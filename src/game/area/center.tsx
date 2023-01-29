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

const NormOutputArea = forwardRef((props: { area: Area, lasted: boolean, output: Array<number> }, ref: Ref<any>) => {

    let [lasted, setLasted] = useState<boolean>(props.lasted)
    let [output, setOutput] = useState<Array<number>>(props.output)
    useImperativeHandle(ref, () => ({
        removeLasted: () => {
            setLasted(false)
        },
        append: (...tiles: number[]) => {
            let existput = output.slice()
            existput = existput.concat(...tiles)
            setOutput(existput)
            setLasted(true)
        },
        remove: (tile: number) => {
            let existput = output.slice()
            //反向查找
            let idx = existput.lastIndexOf(tile)
            if (idx === -1) {
                return
            }
            existput.splice(idx, 1)
            setOutput(existput)
            setLasted(false)
        }
    }))


    useEffect(() => {

    }, [output, lasted])


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
            Array.from(output).map((outItem, idx) => (
                <Grid item key={idx} sx={{ height: MjImageHeight.centerRotate }}>
                    <MjImage mj={outItem} direction={props.area} height={MjImageHeight.center} lasted={lasted && idx === output.length - 1} />
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
            //胡牌可以多方显示
            let hasHu = stateEffect.filter((it) => {
                return it.race === 'hu'
            })

            if (hasHu.length === 0) {
                stateEffect = []
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
    let leftRef: any = useRef(null)
    let rightRef: any = useRef(null)
    let topRef: any = useRef(null)
    let bottomRef: any = useRef(null)
    let effectRef: any = useRef(null)
    let turnRef: any = useRef(null)

    const dispatchRefIns = (area: Area): any => {
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


    useImperativeHandle(ref, () => ({
        output: (area: Area, ...tiles: number[]) => {
            //默认重置所有
            leftRef.current.removeLasted()
            rightRef.current.removeLasted()
            topRef.current.removeLasted()
            bottomRef.current.removeLasted()
            // debugger
            //添加
            dispatchRefIns(area).append(tiles)

        },
        raceOne: (area: Area, tile: number) => {
            dispatchRefIns(area).remove(tile)
        }
    }))

    gameCtx.bindCenterRef(ref)
    return (
        <Stack sx={{ height: '100%', width: '100%', border: '1px dotted black', borderRadius: '20px', position: 'relative' }} justifyContent={'center'} alignItems={'center'} >
            <TurnArea turn={Area.Top} ref={turnRef} />
            <NormOutputArea area={Area.Top} lasted={false} output={[1, 2, 3]} ref={topRef} />
            <NormOutputArea area={Area.Left} lasted={false} output={[4, 5, 6]} ref={leftRef} />
            <NormOutputArea area={Area.Right} lasted={false} output={[11, 12, 13]} ref={rightRef} />
            <NormOutputArea area={Area.Bottom} lasted={true} output={[21, 22, 23]} ref={bottomRef} />
            <RaceEffectArea ref={effectRef} />
        </Stack >
    )
})


const CountdownArea = forwardRef((props: {}, ref: Ref<any>) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateTime, setTime] = useState<number>(30)
    let [stateEnable, setEnable] = useState<boolean>(true)

    useImperativeHandle(ref, () => ({
        suspend: () => {
            setEnable(false)
        },
        start: () => {
            setEnable(true)
        }
    }))


    useEffect(() => {
        if (stateEnable) {
            const interval = setInterval(() => {
                setTime(stateTime--)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            //nothing
            setTime(-1)
        }
    }, [stateEnable])


    gameCtx.bindCountdownRef(ref)
    return (
        <Typography variant='h4' sx={{ color: stateTime === -1 ? 'gray' : (stateTime < 10 ? 'red' : 'orange') }}>
            {stateTime <= 0 ? '--' : stateTime}
        </Typography>
    )
})

const RemainedArea = forwardRef((props: { remained: number }, ref: Ref<any>) => {
    const gameCtx = useContext<GameEventBus>(GameContext)
    let [stateRemained, setRemained] = useState(props.remained)

    useImperativeHandle(ref, () => ({
        // 剩余牌
        updateRemained: () => {
            stateRemained--
            if (stateRemained === 0) {
                stateRemained = 0
            }
            setRemained(stateRemained)
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
    let countdownRef: any = useRef(null)
    let remainedRef: any = useRef(null)

    useImperativeHandle(ref, () => ({
        changeTurn: (turn: Area) => {
            setTurn(turn)

            // 重置计时器
            countdownRef.current.reset()
        }
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
                <RemainedArea remained={123} ref={remainedRef} />
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
