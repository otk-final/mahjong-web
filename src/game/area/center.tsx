import React, { Ref, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { Area, GameContext, PlayerContext, RoomContext } from "../context"
import { Avatar, Box, Grid, Stack, Typography, Zoom } from "@mui/material"

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { MjImage, MjImageHeight } from "../../component/tile";
import { MJRaceFilter } from "../../assets";


const maxOut = 21
const minPx = '30%', maxPx = '70%'

interface RaceEffect {
    Display: boolean,
    Area: Area
    Event: string
}


const NormOutputArea = forwardRef((props: { roomCtx: RoomContext, gameCtx: GameContext, area: Area, lasted: boolean, output: Array<number> }, ref: Ref<any>) => {

    let [lasted, setLasted] = useState<boolean>(props.lasted)
    let [output, setOutput] = useState<Array<number>>(props.output)
    useImperativeHandle(ref, () => ({
        removeLasted: () => {
            setLasted(false)
        },
        append: (tile: number) => {
            let existput = output.slice()
            existput.push(tile)
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


    useEffect(()=>{

    }, [output,lasted])


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


const RaceEffectArea = forwardRef((props: { roomCtx: RoomContext, gameCtx: GameContext }, ref: Ref<any>) => {

    let [stateEffect, setEffect] = useState<Array<effectItem>>([])

    useImperativeHandle(ref, () => ({
        append: (area: Area, race: string) => {
            let sx: any
            if (area === Area.Top) {
                sx = { position: 'absolute', height: 100, width: 100, top: -30 }
            }
            if (area === Area.Left) {
                sx = { position: 'absolute', height: 100, width: 100, left: -30 }
            }
            if (area === Area.Right) {
                sx = { position: 'absolute', height: 100, width: 100, right: -30 }
            }
            if (area === Area.Bottom) {
                sx = { position: 'absolute', height: 100, width: 100, bottom: -100 }
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

    props.gameCtx.bindEffectRef(ref)

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

export const CenterAreaContainer = forwardRef((props: { roomCtx: RoomContext, gameCtx: GameContext }, ref: Ref<any>) => {

    let leftRef: any = useRef(null)
    let rightRef: any = useRef(null)
    let topRef: any = useRef(null)
    let bottomRef: any = useRef(null)
    let effectRef: any = useRef(null)

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
        outputOne: (area: Area, tile: number) => {
            //默认重置所有
            leftRef.current.removeLasted()
            rightRef.current.removeLasted()
            topRef.current.removeLasted()
            bottomRef.current.removeLasted()
            // debugger
            //添加
            dispatchRefIns(area).append(tile)

            //添加特效
            // effectRef.current.append(Area.Left, 'peng')
        },
        raceOne: (area: Area, tile: number) => {
            dispatchRefIns(area).remove(tile)
        }
    }))

    props.gameCtx.bindCenterRef(ref)
    return (
        <Stack sx={{ height: '100%', width: '100%', border: '1px dotted black', borderRadius: '20px', position: 'relative' }} justifyContent={'center'} alignItems={'center'} >
            <CountdownArea turn={''} remained={57} />
            <NormOutputArea roomCtx={props.roomCtx} gameCtx={props.gameCtx} area={Area.Top} lasted={false} output={[1, 2, 3]} ref={topRef} />
            <NormOutputArea roomCtx={props.roomCtx} gameCtx={props.gameCtx} area={Area.Left} lasted={false} output={[4, 5, 6]} ref={leftRef} />
            <NormOutputArea roomCtx={props.roomCtx} gameCtx={props.gameCtx} area={Area.Right} lasted={true} output={[11, 12, 13]} ref={rightRef} />
            <NormOutputArea roomCtx={props.roomCtx} gameCtx={props.gameCtx} area={Area.Bottom} lasted={true} output={[21, 22, 23]} ref={bottomRef} />
            <RaceEffectArea roomCtx={props.roomCtx} gameCtx={props.gameCtx} ref={effectRef} />
        </Stack >
    )
})


// export const CenterAreaContainer2: React.FC<{ roomCtx: RoomContext, gameCtx: GameContext }> = ({ roomCtx, gameCtx }) => {
//     //当前回合
//     let [turn, setTurn] = useState<string>('')
//     //剩余牌数
//     let [remained, setRemained] = useState(0)

//     //已出牌
//     let [leftOut, setLeftOut] = useState<Array<number>>(gameCtx.Lefter!.getOuts())
//     let [rightOut, setRightOut] = useState<Array<number>>(gameCtx.Righter!.getOuts())
//     let [topOut, setTopOut] = useState<Array<number>>(gameCtx.Toper!.getOuts())
//     let [bottomOut, setBottomOut] = useState<Array<number>>(gameCtx.Bottomer!.getOuts())
//     let [lastedArea, setLastedArea] = useState<Area | undefined>()



//     //判定特效
//     let [raceEffects, setRaceEffects] = useState<Array<RaceEffect>>(new Array<RaceEffect>())

//     gameCtx.onTurnChange((event: any) => {
//         setTurn(Area.Bottom)
//     })

//     gameCtx.onRemainedChange((num: number) => {
//         setRemained(num)
//     })

//     gameCtx.onRaceEffect((newEvent: RaceEffect) => {
//         //只有胡牌可以多方渲染显示
//         let notHupai = raceEffects.length === 1 && raceEffects[0].Event !== 'hu'
//         if (notHupai) {
//             raceEffects.pop()
//         }
//         raceEffects.push(newEvent)
//         setRaceEffects(raceEffects)
//     })

//     gameCtx.onOutput((who: Area, tile: number) => {
//         if (who === Area.Left) {
//             leftOut.push(tile)
//             setLeftOut(leftOut.slice())
//         } else if (who === Area.Right) {
//             rightOut.push(tile)
//             setRightOut(rightOut.slice())
//         } else if (who === Area.Top) {
//             topOut.push(tile)
//             setTopOut(topOut.slice())
//         } else if (who === Area.Bottom) {
//             bottomOut.push(tile)
//             setBottomOut(bottomOut.slice())
//         }
//         setLastedArea(who)
//     })


//     const isLastedOuput = (direction: Area, arr: Array<number>, currIdx: number): boolean => {
//         if (direction !== lastedArea) {
//             return false
//         }
//         return currIdx === arr.length - 1
//     }

//     return (
//         <Stack sx={{ height: '100%', width: '100%', border: '1px dotted black', borderRadius: '20px', position: 'relative' }} justifyContent={'center'} alignItems={'center'}>
//             <CountdownArea turn={turn} remained={remained} />
//             <Grid container direction={"row-reverse"} alignItems={'center'} justifyContent={'center'}
//                 columns={maxOut} spacing={0.2}
//                 sx={{
//                     position: 'absolute',
//                     top: '0px',
//                     left: minPx,
//                     width: maxPx,
//                     height: minPx
//                 }}>
//                 {
//                     Array.from(topOut).map((outItem, idx) => (
//                         <Grid item key={idx}>
//                             <MjImage mj={outItem} direction={'top'} height={MjImageHeight.center} lasted={isLastedOuput(Area.Top, topOut, idx)} />
//                         </Grid>
//                     ))
//                 }
//             </Grid>
//             <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'}
//                 sx={{
//                     position: 'absolute',
//                     bottom: minPx,
//                     left: '0px',
//                     width: minPx,
//                     height: maxPx,
//                     padding: '5px'
//                 }}>
//                 {
//                     Array.from(leftOut).map((outItem, idx) => (
//                         <Grid item sx={{ height: MjImageHeight.centerRotate }} key={idx} >
//                             <MjImage mj={outItem} direction={'left'} height={MjImageHeight.center} lasted={isLastedOuput(Area.Left, leftOut, idx)} />
//                         </Grid>
//                     ))
//                 }
//             </Grid>
//             <Grid container direction={'column-reverse'} justifyContent={'center'} alignItems={'center'}
//                 columns={maxOut}
//                 sx={{
//                     position: 'absolute',
//                     bottom: '0px',
//                     right: '0px',
//                     width: minPx,
//                     height: maxPx
//                 }}>
//                 {
//                     Array.from(rightOut).map((outItem, idx) => (
//                         <Grid item sx={{ height: MjImageHeight.centerRotate }} key={idx}>
//                             <MjImage mj={outItem} direction={'right'} height={MjImageHeight.center} lasted={isLastedOuput(Area.Right, rightOut, idx)} />
//                         </Grid>
//                     ))
//                 }

//             </Grid>
//             <Grid container justifyContent={'center'} alignItems={'center'}
//                 columns={maxOut}
//                 spacing={0.2}
//                 sx={{
//                     position: 'absolute',
//                     bottom: '0px',
//                     left: '0px',
//                     width: maxPx,
//                     height: minPx
//                 }}>

//                 {
//                     Array.from(bottomOut).map((outItem, idx) => (
//                         <Grid item xs={'auto'} key={idx} >
//                             <MjImage mj={outItem} direction={'bottom'} height={MjImageHeight.center} lasted={isLastedOuput(Area.Bottom, bottomOut, idx)} />
//                         </Grid>
//                     ))
//                 }
//             </Grid>
//             {
//                 Array.from(raceEffects).map((raceItem: RaceEffect, idx) => (
//                     <Zoom in={raceItem.Display} style={{ position: 'absolute', height: 100, width: 100, right: -30 }}>
//                         <Avatar>{raceItem.Event}</Avatar>
//                     </Zoom>
//                 ))
//             }
//         </Stack >
//     )
// }

const CountdownArea: React.FC<{ turn: string, remained: number }> = ({ turn, remained }) => {

    let [timeNumber, setTimeNumber] = useState(0)
    var cd = new Countdown(30, setTimeNumber)


    useEffect(() => {
        cd.start()
        return () => { cd.exit() }
    })

    return (<Grid container sx={{ height: '25%', width: '25%', position: 'absolute' }}>
        {/*  */}
        <Grid item xs={4}></Grid>
        <Grid item xs={4} justifyContent={'center'} alignItems={'flex-end'} container>
            <ArrowDropUpIcon sx={{ color: turn === 'top' ? 'red' : 'gray' }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4}></Grid>
        {/*  */}
        <Grid item xs={4} justifyContent={'flex-end'} alignItems={'center'} container>
            <ArrowLeftIcon sx={{ color: turn === 'left' ? 'red' : 'gray' }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4} justifyContent={'center'} alignItems={'center'} container >
            <Stack justifyContent={'center'} alignItems={'center'}>
                <Typography variant='h4' sx={{ color: timeNumber === 0 ? 'gray' : (timeNumber < 10 ? 'red' : 'orange') }}>
                    {timeNumber <= 0 ? '--' : timeNumber}
                </Typography>
                <Typography variant='caption' sx={{ color: 'yellow' }}>剩余{remained}张</Typography>
            </Stack>
        </Grid>
        <Grid item xs={4} justifyContent={'flex-start'} alignItems={'center'} container>
            <ArrowRightIcon sx={{ color: turn === 'right' ? 'red' : 'gray' }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4} justifyContent={'center'} alignItems={'flex-start'} container>
            <ArrowDropDownIcon sx={{ color: turn === 'bottom' ? 'red' : 'gray' }} fontSize={'large'} />
        </Grid>
        <Grid item xs={4}></Grid>
    </Grid >)
}


// 计时器
export class Countdown {

    timeOut: number = 0
    interval: any
    // 最大计数
    maxTime: number

    stateInject: any
    constructor(maxTime: number, stateInject: any) {
        this.maxTime = maxTime
        this.stateInject = stateInject
    }

    // 开始
    start() {
        this.interval = setInterval(() => {
            this.timeOut--
            this.stateInject(this.timeOut)
        })
    }

    // 销毁
    exit() {
        clearInterval(this.interval)
    }
}