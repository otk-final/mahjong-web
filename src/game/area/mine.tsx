import React, { Ref, forwardRef, useRef, useState } from "react"
import ReactDom from 'react-dom';
import { Avatar, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { Area, PlayerContext } from "../context";
import { AvatarArea } from "../../component/player";
import { MjBottomImage, MjImage } from "../../component/tile";
import { MJRaceFilter } from "../../assets";


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

function resetNoReadyClass(ele: any) {
    var childs = ele.children
    for (var i = 0; i < childs.length; i++) {
        let sub: any = childs[i]
        if (sub.className.indexOf('hasReady') === -1) {
            continue
        }
        sub.className = sub.className.replace('hasReady', '')
    }
}

export const TileArea = forwardRef((props: { playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }, ref: Ref<any>) => {



    let [stateReady, setReady] = React.useState<Array<number>>([])
    let [stateTake, setTake] = useState<number>(props.take)
    let [stateHands, setHands] = useState<Array<number>>(props.hands)
    let [stateRaces, setRaces] = React.useState<Array<Array<number>>>(props.races)

    // 选择
    let selectReady = (mj: number, ok: boolean) => {
        let exitReady = stateReady.slice()
        if (ok) {
            exitReady.push(mj)
        } else {
            let idx = exitReady.indexOf(mj)
            if (idx !== -1) {
                exitReady.splice(idx, 1)
            }
        }
        setReady(exitReady)
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
                                    <MjImage direction={'bottom'} height={'45px'} mj={raceItem} key={idx} extra={props.playerCtx.gameCtx.getMjExtra(raceItem)} />
                                ))
                            }
                        </Stack>
                    ))
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={0.5} ref={handRef}>
                {
                    Array.from(stateHands).map((handItem, idx) => (
                        <MjBottomImage mj={handItem} key={idx} callPut={selectReady} extra={props.playerCtx.gameCtx.getMjExtra(handItem)} />
                    ))
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                {stateTake !== -1 && <MjBottomImage mj={stateTake} callPut={selectReady} extra={props.playerCtx.gameCtx.getMjExtra(stateTake)} />}
            </Stack>
        </Stack>
    )
})


export const MineAreaContainer: React.FC<{ playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerCtx, take, hands, races }) => {

    console.info('MineAreaContainer')
    //牌库状态
    let [mineOptions, setOptions] = React.useState<Array<string>>(['peng', 'gang', 'chi', 'hu', 'pass'])
    let tileRef = React.useRef(null)
    let raceRef = React.useRef(null)

    let submitConfirm = (race: string) => {

        let raceIns: any = raceRef.current
        let tileIns: any = tileRef.current

        //跳过直接摸牌
        if (race === 'pass') {
            return ignoreAndTake(tileIns)
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
        playerCtx.gameCtx.effectRef.current.append(Area.Left, race)

        //output
        playerCtx.gameCtx.centerRef.current.outputOne(Area.Left, ready[0])

        //set value and clear css
        tileIns.resetHands(hands)
        tileIns.resetReady()
        raceIns.resetOptions(["hu", "pass"])
    }

    function showEffect() {

    }

    function ignoreAndTake(tileIns: any) {
        tileIns.resetTake(24)
    }

    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={4} justifyContent={'center'} >
                <RaceArea submitCall={(race: string) => { submitConfirm(race) }} options={mineOptions} ref={raceRef} />
            </Grid>
            <Grid item container xs justifyContent={'center'} alignItems={'center'} >
                <TileArea playerCtx={playerCtx} take={take} hands={hands} races={races} ref={tileRef} />
            </Grid>
            <Grid container item xs={2} justifyContent={'center'} alignItems={'center'}>
                <Grid item>
                    <Button variant="contained" color="warning" size="small">我要明牌</Button>
                </Grid>
                <Grid item container xs={6} justifyContent={'center'} alignItems={'center'}>
                    <AvatarArea user={playerCtx.info} />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="small">挂机托管</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}