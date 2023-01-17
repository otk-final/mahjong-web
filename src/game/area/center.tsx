import React, { useEffect, useState } from "react"
import { Area, GameContext, RoomContext } from "../context"
import { Avatar, Grid, Stack, Typography, Zoom } from "@mui/material"

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { MjImage, MjImageHeight } from "../../component/tile";


const maxOut = 21
const minPx = '30%', maxPx = '70%'

interface RaceEffect {
    Display: boolean,
    Area: Area
    Event: string
}

interface Output {
    Left: Array<number>,
    Right: Array<number>,
    Top: Array<number>
    Bottom: Array<number>,
    Lasted: Area,
}

export const CenterAreaContainer: React.FC<{ roomCtx: RoomContext, gameCtx: GameContext }> = ({ roomCtx, gameCtx }) => {

    //已出牌
    let [output, setOutput] = useState<Output>({
        Left: gameCtx.Lefter!.getOuts(),
        Right: gameCtx.Righter!.getOuts(),
        Top: gameCtx.Toper!.getOuts(),
        Bottom: gameCtx.Bottomer!.getOuts(),
        Lasted: Area.Nil,
    })

    //当前回合
    let [turn, setTurn] = useState<string>('')
    //剩余牌数
    let [remained, setRemained] = useState(0)
    //判定特效
    let [raceEffects, setRaceEffects] = useState<Array<RaceEffect>>(new Array<RaceEffect>())

    gameCtx.onTurnChange((event: any) => {
        setTurn(Area.Bottom)
    })

    gameCtx.onRemainedChange((num: number) => {
        setRemained(num)
    })

    gameCtx.onRaceEffect((newEvent: RaceEffect) => {
        //只有胡牌可以多方渲染显示
        let notHupai = raceEffects.length === 1 && raceEffects[0].Event !== 'h'
        if (notHupai) {
            raceEffects.pop()
        }
        raceEffects.push(newEvent)
        setRaceEffects(raceEffects)
    })

    gameCtx.onOutput((who: Area, tile: number) => {
        output.Lasted = who
        if (who === Area.Left) {
            output.Left.push(tile)
        } else if (who === Area.Right) {
            output.Right.push(tile)
        } else if (who === Area.Top) {
            output.Top.push(tile)
        } else if (who === Area.Bottom) {
            output.Bottom.push(tile)
        }
        setOutput(output)
    })



    return (
        <Stack sx={{ height: '100%', width: '100%', border: '1px dotted black', borderRadius: '20px', position: 'relative' }} justifyContent={'center'} alignItems={'center'}>
            <CountdownArea turn={turn} remained={remained} />
            <Grid container direction={"row-reverse"} alignItems={'center'} justifyContent={'center'}
                columns={maxOut} spacing={0.2}
                sx={{
                    position: 'absolute',
                    top: '0px',
                    left: minPx,
                    width: maxPx,
                    height: minPx
                }}>
                {
                    Array.from(output.Top).map((outItem, idx) => (
                        <Grid item key={idx}>
                            <MjImage mj={outItem} direction={'top'} height={MjImageHeight.center} />
                        </Grid>
                    ))
                }

            </Grid>
            <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'}
                sx={{
                    position: 'absolute',
                    bottom: minPx,
                    left: '0px',
                    width: minPx,
                    height: maxPx,
                    padding: '5px'
                }}>
                {
                    Array.from(output.Left).map((outItem, idx) => (
                        <Grid item sx={{ height: MjImageHeight.centerRotate }} key={idx} >
                            <MjImage mj={outItem} direction={'left'} height={MjImageHeight.center} />
                        </Grid>
                    ))
                }
            </Grid>
            <Grid container direction={'column-reverse'} justifyContent={'center'} alignItems={'center'}
                columns={maxOut}
                sx={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: minPx,
                    height: maxPx
                }}>
                {
                    Array.from(output.Right).map((outItem, idx) => (
                        <Grid item sx={{ height: MjImageHeight.centerRotate }} key={idx}>
                            <MjImage mj={outItem} direction={'right'} height={MjImageHeight.center} />
                        </Grid>
                    ))
                }

            </Grid>
            <Grid container justifyContent={'center'} alignItems={'center'}
                columns={maxOut}
                spacing={0.2}
                sx={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '0px',
                    width: '70%',
                    height: '30%'
                }}>

                {
                    Array.from(output.Bottom).map((outItem, idx) => (
                        <Grid item xs={'auto'} key={idx} >
                            <MjImage mj={outItem} direction={'bottom'} height={MjImageHeight.center} />
                        </Grid>
                    ))
                }
            </Grid>
            {
                Array.from(raceEffects).map((raceItem: RaceEffect, idx) => (
                    <Zoom in={raceItem.Display} style={{ position: 'absolute', height: 100, width: 100, right: -30 }}>
                        <Avatar>{raceItem.Event}</Avatar>
                    </Zoom>
                ))
            }
        </Stack >
    )
}

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