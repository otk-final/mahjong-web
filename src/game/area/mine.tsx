import React, { Ref, forwardRef, useContext, useState } from "react"
import ReactDom from 'react-dom';
import { Avatar, Button, Divider, Grid, Stack } from "@mui/material";
import { GameContext, GameEventBus, PlayerReducer } from "../context";
import { AvatarArea } from "../../component/player";
import { MjBottomImage, MjImage } from "../../component/tile";
import { MJRaceFilter } from "../../assets";
import { Area } from "../context/util";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SmartToyIcon from '@mui/icons-material/SmartToy';


export const RaceArea = forwardRef((props: { submitCall: any, options: Array<string> }, ref: Ref<any>) => {

    let [stateOptions, setOptions] = React.useState<Array<string>>(props.options)
    const submitClick = (race: string) => {
        return props.submitCall(race)
    }

    React.useImperativeHandle(ref, () => ({
        resetOptions: (actions: Array<string>) => {
            setOptions(actions)
        }
    }))

    return (
        <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
            {
                Array.from(stateOptions).map((raceOps, idx) => (
                    <Grid item key={idx}>
                        <Avatar src={MJRaceFilter(raceOps)}
                            sx={{ minHeight: raceOps === 'hu' ? '60px' : 'auto', minWidth: raceOps === 'hu' ? '60px' : 'auto' }}
                            onClick={(e) => submitClick(raceOps)}></Avatar>
                    </Grid>
                ))
            }
        </Grid >)
})

// function resetNoReadyClass(ele: any) {
//     var childs = ele.children
//     for (var i = 0; i < childs.length; i++) {
//         let sub: any = childs[i]
//         if (sub.className.indexOf('hasReady') === -1) {
//             continue
//         }
//         sub.className = sub.className.replace('hasReady', '')
//     }
// }

export const TileArea = forwardRef((props: { mineRedux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }, ref: Ref<any>) => {


    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateReady, setReady] = React.useState<Array<number>>([])
    let [stateTake, setTake] = useState<number>(props.take)
    let [stateHands, setHands] = useState<Array<number>>(props.hands)
    let [stateRaces, setRaces] = React.useState<Array<Array<number>>>(props.races)

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

    let handRef = React.createRef<HTMLElement>()
    //暴露给父组件使用
    React.useImperativeHandle(ref, () => ({
        getReady: (): Array<number> => {
            return stateReady.slice()
        },
        resetReady: () => {
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
            //清空数据
            setReady([])
        },
        getHands: (): Array<number> => {
            let nowHands = stateHands.slice()
            if (stateTake !== -1) {
                nowHands.push(stateTake)
            }
            return nowHands
        },
        resetHands: (tiles: Array<number>) => {
            tiles.sort((a, b) => a - b)
            setHands(tiles)
            setTake(-1)
        },
        resetTake: (tile: number) => {
            debugger
            setTake(tile)
        },
        mergeTake: () => {
            let nowHands = stateHands.slice()
            if (stateTake !== -1) {
                nowHands.push(stateTake)
                setTake(-1)
            }
            setHands(nowHands)
        },
        appendRace: (race: Array<number>) => {
            stateRaces.push(race)
            setRaces(stateRaces)
        },
    }))

    return (
        <Stack
            direction={'row'}
            divider={<Divider orientation="vertical" flexItem />}
            alignItems="center"
            spacing={2}
        >
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
                {
                    Array.from(stateRaces).map((raceGroup, idx) => (
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
                    Array.from(stateHands).map((handItem, idx) => (
                        <MjBottomImage mj={handItem} key={idx} callPut={selectReady} extra={gameCtx.getMjExtra(handItem)} />
                    ))
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                {stateTake !== -1 && <MjBottomImage mj={stateTake} callPut={selectReady} extra={gameCtx.getMjExtra(stateTake)} />}
            </Stack>
        </Stack>
    )
})


export const MineAreaContainer: React.FC<{ redux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ redux, take, hands, races }) => {

    const gameCtx = useContext<GameEventBus>(GameContext)

    //牌库状态
    let [mineOptions, setOptions] = React.useState<Array<string>>(['peng', 'gang', 'chi', 'hu', 'pass'])
    let tileRef = React.useRef()
    let raceRef = React.useRef()

    let submitConfirm = (race: string) => {

        let raceIns: any = raceRef.current
        let tileIns: any = tileRef.current

        //跳过直接摸牌
        if (race === 'pass') {
            return ignoreAndTake(gameCtx, tileIns)
        }

        let ready = tileIns.getReady()
        if (ready.length === 0) {
            return
        }
        //有可能 take hand 同时提交 获取全量
        let hands = tileIns.getHands()
        //移除牌
        ready.forEach((item: number) => {
            let idx = hands.indexOf(item)
            if (idx !== -1) hands.splice(idx, 1)
        });

        //show effect
        gameCtx.doEffect(Area.Left, race)

        //output
        gameCtx.doOutput(Area.Left, ...ready)

        //set value and clear css
        tileIns.resetHands(hands)
        tileIns.resetReady()
        raceIns.resetOptions(["hu", "pass"])
    }

    let startGame = (event: any) => {
        gameCtx.start()
    }

    let exitGame = (event: any) => {
        gameCtx.exit()
    }

    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={4} justifyContent={'center'} >
                <RaceArea submitCall={(race: string) => { submitConfirm(race) }} options={mineOptions} ref={raceRef} />
            </Grid>
            <Grid item container xs justifyContent={'center'} alignItems={'center'} >
                <TileArea mineRedux={redux} take={take} hands={hands} races={races} ref={tileRef} />
            </Grid>
            <Grid container item xs={2} spacing={2} justifyContent={'center'} alignItems={'center'}>
                <Grid item>
                    <Button variant="contained" color="info" size="small" startIcon={<PlayCircleOutlineIcon />} onClick={(e) => { startGame(e) }} >开始游戏</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="warning" size="small" startIcon={<VisibilityIcon />} >我要明牌</Button>
                </Grid>
                <Grid item container xs={5} justifyContent={'center'} alignItems={'center'}>
                    <AvatarArea user={redux.player} />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="small" startIcon={<SmartToyIcon />} >挂机托管</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" startIcon={<ExitToAppIcon />} color="info" size="small" onClick={(e) => { exitGame(e) }} >退出游戏</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}


function ignoreAndTake(gameCtx: GameEventBus, tileIns: any) {
    tileIns.resetTake(24)
}