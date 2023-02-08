import React, { Ref, useEffect, useRef, useState, forwardRef, useImperativeHandle, useContext } from "react"
import { GameContext, GameEventBus } from "../context"
import { Avatar, Grid, Stack, Typography, Zoom } from "@mui/material"

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { MjImage, MjImageHeight } from "../../component/tile";
import { MJRaceFilter } from "../../assets";
import { Area } from "../context/util";


const maxOut = 21
const minPx = '30%', maxPx = '70%'

const NormOutputArea = forwardRef((props: { area: Area }, ref: Ref<any>) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    const redux = gameCtx.getPlayerReducer(props.area)

    let [stateLasted, setLasted] = useState<boolean>(() => {
        return redux ? redux!.isLastedOuput() : false
    })
    let [stateOutput, setOutput] = useState<Array<number>>(() => {
        return redux ? redux!.getOuts() : []
    })

    useImperativeHandle(ref, () => ({
        updateLasted: (enabel: boolean) => {
            if (stateLasted === enabel) {
                return
            }
            setLasted(enabel)
        },
        append: (...tiles: number[]) => {
            let existput = stateOutput.slice()
            existput = existput.concat(...tiles)
            setOutput(existput)
        },
        remove: (tile: number) => {
            let existput = stateOutput.slice()
            //反向查找
            let idx = existput.lastIndexOf(tile)
            if (idx === -1) {
                return
            }
            existput.splice(idx, 1)
            setOutput(existput)
        }
    }))




    // 样式
    let sxx: any
    let directionGrid: any
    let spacingGrid: any
    if (props.area === Area.Top) {
        directionGrid = 'row-reverse'
        spacingGrid = 0.2
        sxx = { position: 'absolute', top: '0px', left: minPx, width: maxPx, height: minPx }
    } else if (props.area === Area.Left) {
        directionGrid = 'column'
        spacingGrid = 0
        sxx = { position: 'absolute', bottom: minPx, left: '0px', width: minPx, height: maxPx, padding: '5px' }
    } else if (props.area === Area.Right) {
        sxx = { position: 'absolute', bottom: '0px', right: '0px', width: minPx, height: maxPx }
        directionGrid = 'column-reverse'
        spacingGrid = 0
    } else {
        sxx = { position: 'absolute', bottom: '0px', left: '0px', width: maxPx, height: minPx }
        directionGrid = "row"
        spacingGrid = 0.2
    }


    return (<Grid container direction={directionGrid} alignItems={'center'} justifyContent={'center'}
        columns={maxOut} spacing={spacingGrid}
        sx={sxx}>
        {
            Array.from(stateOutput).map((outItem, idx) => (
                <Grid item key={idx} sx={{ height: MjImageHeight.centerRotate }}>
                    <MjImage mj={outItem} direction={props.area} height={MjImageHeight.center} lasted={stateLasted && idx === stateOutput.length - 1} />
                </Grid>
            ))
        }
    </Grid>)
})


interface effectItem {
    area: Area,
    sx: any,
    display: boolean,
    race: string
}


const RaceEffectArea = forwardRef((props: {}, ref: Ref<any>) => {


    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateEffect, setEffect] = useState<Array<effectItem>>([])


    useImperativeHandle(ref, () => ({
        append: (area: Area, race: string) => {
            debugger
            let sx: any = { position: 'absolute', height: 100, width: 100 }
            if (area === Area.Top) {
                sx.top = -30
            }
            if (area === Area.Left) {
                sx.left = -30
            }
            if (area === Area.Right) {
                sx.right = -30
            }
            if (area === Area.Bottom) {
                sx.bottom = -30
            }
            stateEffect.push({ area: area, sx: sx, display: true, race: race })
            setEffect(stateEffect)
        },
        remove: () => {
            setEffect([])
        }
    }))

    gameCtx.bindEffectRef(ref)

    return (<Grid container sx={{ height: '100%', width: '100%', position: 'relative' }} justifyContent={'center'} alignItems={'center'} >
        {
            Array.from(stateEffect).map((item: effectItem, idx) => (
                <Zoom in={item.display} style={item.sx} key={idx}>
                    <Avatar src={MJRaceFilter(item.race)}></Avatar>
                </Zoom>
            ))
        }
    </Grid>)
})

export const CenterAreaContainer = forwardRef((props: {}, ref: Ref<any>) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    let leftRef: any = useRef()
    let rightRef: any = useRef()
    let topRef: any = useRef()
    let bottomRef: any = useRef()
    let effectRef: any = useRef()
    let turnRef: any = useRef()

    const findOutputRef = (area: Area): any => {
        if (area === Area.Top) {
            return topRef.current
        }
        if (area === Area.Left) {
            return leftRef.current
        }
        if (area === Area.Right) {
            return rightRef.current
        }
        return bottomRef.current
    }

    const resetLasted = (area: Area) => {
        //默认重置所有
        [Area.Left, Area.Bottom, Area.Top, Area.Right].forEach((item: Area) => {
            findOutputRef(item).updateLasted(area === item)
        })
    }

    useImperativeHandle(ref, () => ({
        output: (area: Area, ...tiles: number[]) => {
            //添加
            const ref = findOutputRef(area)
            ref.append(tiles)
        },
        outLastedChange: (area: Area) => {
            return resetLasted(area)
        },
        raceby: (area: Area, tile: number) => {
            //移除
            const ref = findOutputRef(area)
            ref.remove(tile)

            ref.updateLasted(false)
        }
    }))

    gameCtx.bindCenterRef(ref)
    return (
        <Stack sx={{ height: '100%', width: '100%', border: '1px dotted black', borderRadius: '20px', position: 'relative' }} justifyContent={'center'} alignItems={'center'} >
            <TurnArea turn={Area.Nil} ref={turnRef} />
            <NormOutputArea area={Area.Top} ref={topRef} />
            <NormOutputArea area={Area.Left} ref={leftRef} />
            <NormOutputArea area={Area.Right} ref={rightRef} />
            <NormOutputArea area={Area.Bottom} ref={bottomRef} />
            <RaceEffectArea ref={effectRef} />
        </Stack >
    )
})


const CountdownArea = forwardRef((props: {}, ref: Ref<any>) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateDuration, setDuration] = useState<number>(0)

    useImperativeHandle(ref, () => ({
        start: (duration: number) => { setDuration(duration); }
    }))

    useEffect(() => {
        //定时
        let tempDuration = stateDuration
        if (tempDuration === 0) {
            return;
        }
        const interval = setInterval(() => { setDuration(tempDuration--) }, 900)
        return () => { clearInterval(interval) }
    })

    gameCtx.bindCountdownRef(ref)
    return (
        <Typography variant='h4' sx={{ color: stateDuration === -1 ? 'gray' : (stateDuration < 10 ? 'red' : 'orange') }}>
            {stateDuration <= 0 ? '--' : stateDuration}
        </Typography>
    )
})

const RemainedArea = forwardRef((props: { remained: number }, ref: Ref<any>) => {
    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateRemained, setRemained] = useState(props.remained)

    useImperativeHandle(ref, () => ({
        updateRemained: (num: number) => {
            setRemained(num)
        },
    }))

    gameCtx.bindRemainedRef(ref)
    return (
        <Typography variant='caption' sx={{ color: 'yellow' }}>剩余{stateRemained}张</Typography>
    )
})

const TurnArea = forwardRef((props: { turn: Area }, ref: Ref<any>) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateTurn, setTurn] = useState(props.turn)
    let countdownRef: any = useRef()
    let remainedRef: any = useRef()

    useImperativeHandle(ref, () => ({
        changeTurn: (turn: Area) => { setTurn(turn) }
    }))

    const turnColor = (area: Area): string => {
        return stateTurn === area ? 'red' : 'gray'
    }

    gameCtx.bindTurnRef(ref)

    return (<Grid container sx={{ height: '25%', width: '25%', position: 'absolute' }}>
        {/*  */}
        <Grid item xs={4}></Grid>
        <Grid item xs={4} justifyContent={'center'} alignItems={'flex-end'} container>
            <ArrowDropUpIcon sx={{ color: turnColor(Area.Top) }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4}></Grid>
        {/*  */}
        <Grid item xs={4} justifyContent={'flex-end'} alignItems={'center'} container>
            <ArrowLeftIcon sx={{ color: turnColor(Area.Left) }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4} justifyContent={'center'} alignItems={'center'} container >
            <Stack justifyContent={'center'} alignItems={'center'}>
                <CountdownArea ref={countdownRef} />
                <RemainedArea remained={0} ref={remainedRef} />
            </Stack>
        </Grid>
        <Grid item xs={4} justifyContent={'flex-start'} alignItems={'center'} container>
            <ArrowRightIcon sx={{ color: turnColor(Area.Right) }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4} justifyContent={'center'} alignItems={'flex-start'} container>
            <ArrowDropDownIcon sx={{ color: turnColor(Area.Bottom) }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4}></Grid>
    </Grid >)
})
