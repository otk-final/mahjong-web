import React, { Ref, forwardRef, useContext, useImperativeHandle, useState } from "react"
import ReactDom from 'react-dom';
import { Avatar, Button, Divider, Grid, Stack } from "@mui/material";
import { GameContext, GameEventBus, PlayerReducer, TileCollect } from "../context";
import { AvatarArea } from "../../component/player";
import { MjBottomImage, MjImage } from "../../component/tile";
import { MJRaceFilter } from "../../assets";
import { Area, FindArea } from "../context/util";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { NotifyBus, NotifyContext } from "../../component/alert";
import { playProxy } from "../../api/http";


export const RaceArea = forwardRef((props: { mineRedux: PlayerReducer, submitCall: any, options: Array<number> }, ref: Ref<any>) => {

    let [stateOptions, setOptions] = React.useState<Array<number>>(props.options)
    const submitClick = (race: number) => {
        return props.submitCall(race)
    }

    React.useImperativeHandle(ref, () => ({
        updateOptions: (actions: Array<number>) => { setOptions(actions) },
        removeOptions: () => { setOptions([]) }
    }))
    props.mineRedux.bindRaceRef(ref)

    const sizeFilter = (race: number): string => {
        if (race === 200) {
            return '65px'
        }
        if (race === 0 || race === 1 || race === 2) {
            return '50px'
        }
        return 'auto'
    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
            {
                Array.from(stateOptions).map((raceOps, idx) => (
                    <Grid item key={idx}>
                        <Avatar src={MJRaceFilter(raceOps)}
                            sx={{ minHeight: sizeFilter(raceOps), minWidth: sizeFilter(raceOps) }}
                            onClick={(e) => submitClick(raceOps)}></Avatar>
                    </Grid>
                ))
            }
        </Grid >)
})


interface CanReadyTile {
    tile: number,
    ready: boolean
}

export const TileArea = forwardRef((props: { mineRedux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }, ref: Ref<any>) => {


    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateReady, setReady] = React.useState<Array<number>>([])
    let [stateTile, setTile] = useState<TileCollect>(props.mineRedux.getTileCollect())

    // 选择
    let selectReady = (mj: number, ok: boolean) => {
        let existReady = stateReady.slice()
        if (ok) {
            existReady.push(mj)
        } else {
            let idx = existReady.indexOf(mj)
            if (idx !== -1) {
                existReady.splice(idx, 1)
            }
        }
        setReady(existReady)
    }

    let removeReadyCss = () => {
        //修改css
        let handElement: any = ReactDom.findDOMNode(handRef.current)
        var childs = handElement.children
        for (var i = 0; i < childs.length; i++) {
            let sub: any = childs[i]
            if (sub.className.indexOf('hasReady') === -1) {
                continue
            }
            sub.className = sub.className.replace('hasReady', '')
        }
        setReady([])
    }

    let handRef = React.createRef<HTMLElement>()
    //暴露给父组件使用
    useImperativeHandle(ref, () => ({
        getReady: (): Array<number> => {
            return stateReady.slice()
        },
        updateTileCollect(tile: TileCollect) {
            setTile(tile)
            removeReadyCss()
        }
    }))

    props.mineRedux.bindTileRef(ref)

    return (
        <Stack
            direction={'row'}
            divider={<Divider orientation="vertical" flexItem />}
            alignItems="center"
            spacing={2}
        >
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
                {
                    Array.from(stateTile.races).map((raceGroup, idx) => (
                        <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} key={idx}>
                            {
                                Array.from(raceGroup).map((raceItem, idx) => (
                                    <MjImage direction={'bottom'} height={'45px'} mj={raceItem} key={idx} extra={gameCtx.getMjExtra(raceItem)} />
                                ))
                            }
                        </Stack>
                    ))
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={0.5} ref={handRef}>
                {
                    Array.from(stateTile.hands).map((handItem, idx) => (
                        <MjBottomImage mj={handItem} key={idx} setReadyCall={selectReady} extra={gameCtx.getMjExtra(handItem)} />
                    ))
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                {stateTile.take !== -1 && <MjBottomImage mj={stateTile.take} setReadyCall={selectReady} extra={gameCtx.getMjExtra(stateTile.take)} />}
            </Stack>
        </Stack>
    )
})

export const MineAreaContainer: React.FC<{ redux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ redux, take, hands, races }) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    const notifyCtx = useContext<NotifyBus>(NotifyContext)


    // const mineOptions = [200, 201, 202, 203, 204, 205, 206, 0, 1, 2]
    const mineOptions = new Array<number>()

    //牌库状态
    let tileRef = React.useRef()
    let raceRef = React.useRef()


    let submitConfirm = (race: number) => {

        //已选中
        let ready = redux.getTileCurrent().getReady()
        if (race === 0) {
            //跳过直接摸牌
            return doIgnore(gameCtx, redux)
        } else if (race === 1) {
            if (ready.length !== 1) {
                return notifyCtx.warn("选择一张牌")
            }
            //出牌
            return doPut(gameCtx, redux, ready)
        } else if (race === 2) {
            //摸牌
            return doTake(gameCtx, redux)
        } else if (race === 200) {
            //胡牌
            return doHu(gameCtx, redux)
        } else {
            if (ready.length === 0) {
                return notifyCtx.warn("操作非法")
            }
            //TODO 判定数量
            return doRace(gameCtx, redux, race, ready)
        }
    }

    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={4} justifyContent={'center'} >
                <RaceArea mineRedux={redux} submitCall={(race: number) => { submitConfirm(race) }} options={mineOptions} ref={raceRef} />
            </Grid>
            <Grid item container xs justifyContent={'center'} alignItems={'center'} >
                <TileArea mineRedux={redux} take={take} hands={hands} races={races} ref={tileRef} />
            </Grid>
            <Grid container item xs={2} spacing={2} justifyContent={'center'} alignItems={'center'}>
                <Grid item>
                    <Button variant="contained" color="info" size="small" startIcon={<PlayCircleOutlineIcon />} onClick={() => { gameCtx.startGame() }} >开始游戏</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="warning" size="small" startIcon={<VisibilityIcon />} >我要明牌</Button>
                </Grid>
                <Grid item container xs={5} justifyContent={'center'} alignItems={'center'}>
                    <AvatarArea user={redux.player} />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="small" startIcon={<SmartToyIcon />} onClick={(e) => { gameCtx.doRobot(true) }}>挂机托管</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" startIcon={<ExitToAppIcon />} color="info" size="small" onClick={(e) => { gameCtx.exitGame() }} >退出游戏</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}





function doIgnore(gameCtx: GameEventBus, redux: PlayerReducer) {
    const params = { roomId: gameCtx.roomId }
    return playProxy(gameCtx.mine.uid).ignore(params).then((resp: any) => {
        redux.getRaceCurrent().updateOptions([])
    }).catch(err => {
        gameCtx.notifyCtx?.error(err)
    })
}


function doHu(gameCtx: GameEventBus, redux: PlayerReducer) {
    const params = { roomId: gameCtx.roomId }
    playProxy(gameCtx.mine.uid).win(params).then((resp: any) => {
        redux.getRaceCurrent().updateOptions([])

        //移除对手牌
        if (gameCtx.mine.idx !== resp.data.target) {

            const targetArea = FindArea(gameCtx.mine.idx, resp.data.target)
            gameCtx.doRaceby(targetArea, resp.data.targetTile)

            redux.doTake(resp.data.targetTile)
        }

        gameCtx.doEffect(Area.Bottom, resp.data.effect)
    }).catch(err => {
        gameCtx.notifyCtx?.error(err)
    })
}

function doTake(gameCtx: GameEventBus, redux: PlayerReducer) {
    return triggerTake(gameCtx, redux, 1)
}


export function triggerTake(gameCtx: GameEventBus, redux: PlayerReducer, direction: number) {
    const params = { roomId: gameCtx.roomId, direction: direction }
    playProxy(gameCtx.mine.uid).take(params).then((resp: any) => {
        //渲染页面
        redux.setTileCollect({
            hands: resp.data.hands,
            races: resp.data.races,
            take: resp.data.take,
            outs: resp.data.outs
        })
        gameCtx.doUpdateRemained(resp.data.remained)
        //可用策略
        const raceOptions = resp.data.options.map((item: any) => {
            return item.raceType
        })
        redux.getRaceCurrent().updateOptions(raceOptions)
    }).catch(err => {
        gameCtx.notifyCtx?.error(err)
    })
}



export function triggerRacePre(gameCtx: GameEventBus, redux: PlayerReducer, ackId: number) {

    const params = { roomId: gameCtx.roomId, ackId: ackId }
    return playProxy(gameCtx.mine.uid).racePre(params).then((resp: any) => {

        //可用策略
        const options = resp.data.options.map((item: any) => {
            return item.raceType
        })
        if (options.length > 0) redux.getRaceCurrent().updateOptions(options)
    }).catch(err => {
        gameCtx.notifyCtx?.error(err)
    })
}


function doPut(gameCtx: GameEventBus, redux: PlayerReducer, output: Array<number>) {
    const params = { roomId: gameCtx.roomId, who: gameCtx.mine.idx, round: 0, tile: output[0] }
    playProxy(gameCtx.mine.uid).put(params).then((resp: any) => {

        //渲染页面
        redux.setTileCollect({
            hands: resp.data.hands,
            races: resp.data.races,
            take: -1,
            outs: resp.data.outs
        })

        redux.getRaceCurrent().updateOptions([])
        gameCtx.doOutputAndLasted(Area.Bottom, ...output)
    }).catch(err => {
        gameCtx.notifyCtx?.error(err)
    })
}



function doRace(gameCtx: GameEventBus, redux: PlayerReducer, race: number, readys: Array<number>) {

    const params = {
        roomId: gameCtx.roomId,
        round: 0,
        raceType: race,
        tiles: readys,
    }
    playProxy(gameCtx.mine.uid).race(params).then((resp: any) => {
        //可用策略
        const options = resp.data.options.map((item: any) => {
            return item.raceType
        })
        redux.getRaceCurrent().updateOptions(options)

        //渲染页面
        redux.setTileCollect({
            hands: resp.data.hands,
            races: resp.data.races,
            take: resp.data.continueTake,
            outs: resp.data.outs
        })

        //移除对手牌
        if (gameCtx.mine.idx !== resp.data.target) {
            const targetArea = FindArea(gameCtx.mine.idx, resp.data.target)
            gameCtx.doRaceby(targetArea, resp.data.targetTile)
        }

        gameCtx.doEffect(Area.Bottom, race)
    }).catch(err => {
        gameCtx.notifyCtx?.error(err)
    })
}

