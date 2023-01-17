import React from "react"
import ReactDom from 'react-dom';
import { Avatar, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { Area, PlayerContext } from "../context";
import { AvatarArea } from "../../component/player";
import { MjBottomImage, MjImage } from "../../component/tile";
import { MJRaceFilter } from "../../assets";


export const RaceArea: React.FC<{ raceCall: any, races: Array<string> }> = ({ raceCall, races }) => {

    let [raceOptions, setRaceOptions] = React.useState<Array<string>>(races)
    const raceClick = (event: any, race: string) => {
        raceCall(race)
    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
            {
                Array.from(raceOptions).map((raceOps, idx) => (
                    <Grid item key={idx}>
                        <Avatar src={MJRaceFilter(raceOps)}
                            sx={{ minHeight: raceOps === 'hu' ? '60px' : 'auto', minWidth: raceOps === 'hu' ? '60px' : 'auto' }}
                            onClick={(e) => raceClick(e, raceOps)}></Avatar>
                    </Grid>
                ))
            }
        </Grid >)
}

function resetNoReadyClass(ele: any) {
    var childs = ele.children
    for (var i = 0; i < childs.length; i++) {
        let sub = childs[i]
        if (sub.className.indexOf('hasReady') === -1) {
            continue
        }
        sub.className = sub.className.replace('hasReady', '')
    }
}

export const MineAreaContainer: React.FC<{ playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerCtx, take, hands, races }) => {

    //牌库状态
    let [mineHands, setMineHands] = React.useState<Array<number>>(hands)
    let [mineRaces, setRaces] = React.useState<Array<Array<number>>>(races)
    let [mineTake, setMineTake] = React.useState<number>(take)
    let handRef = React.createRef<HTMLElement>()

    let [readyPuts, setReadyPuts] = React.useState<Array<number>>([])

    // 出牌就绪事件
    let readyPutCall = (mj: number, ok: boolean) => {
        let exitReady = readyPuts.slice()
        if (ok) {
            exitReady.push(mj)
        } else {
            let idx = exitReady.indexOf(mj)
            if (idx !== -1) {
                exitReady.splice(idx, 1)
            }
        }
        setReadyPuts(exitReady)
    }

    const raceConfirm = (race: string) => {

        if (readyPuts.length === 0) {
            return
        }

        //不管打出任何牌，将最后摸牌添加到手牌中再进行删除重整
        let currentHands = mineHands.slice()
        if (take !== -1) {
            currentHands.push(take)
        }

        //移除牌
        readyPuts.forEach(item => {
            let idx = currentHands.indexOf(item)
            if (idx !== -1) currentHands.splice(idx, 1)
        });

        //api
        if (race === 'hu') {

        } else if (race === 'peng') {

        } else if (race === 'gang') {

        } else if (race === 'chi') {

        } else if (race === 'output') {

        }


        //重排序
        currentHands.sort((a, b) => { return a - b })

        //更新页面
        setMineHands(currentHands)

        //修改css
        let handElement = ReactDom.findDOMNode(handRef.current)
        resetNoReadyClass(handElement)

        
        playerCtx.gameCtx.injectOutput(Area.Top, readyPuts[0])

        //清空就绪牌
        setReadyPuts([])
    }

    let raceOptions = ['peng', 'gang', 'chi', 'hu', 'pass']

    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={4} justifyContent={'center'} >
                <RaceArea raceCall={raceConfirm} races={raceOptions} />
            </Grid>
            <Grid item container xs justifyContent={'center'} alignItems={'center'} >
                <Stack
                    direction={'row'}
                    divider={<Divider orientation="vertical" flexItem />}
                    alignItems="center"
                    spacing={2}
                >
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
                        {
                            Array.from(mineRaces).map((raceGroup, idx) => (
                                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} key={idx}>
                                    {
                                        Array.from(raceGroup).map((raceItem, idx) => (
                                            <MjImage direction={'bottom'} height={'45px'} mj={raceItem} key={idx} />
                                        ))
                                    }
                                </Stack>
                            ))
                        }
                    </Stack>
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={0.5} ref={handRef}>
                        {
                            Array.from(mineHands).map((handItem, idx) => (
                                <MjBottomImage mj={handItem} key={idx} callPut={readyPutCall} />
                            ))
                        }
                    </Stack>
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                        {mineTake !== -1 && <MjBottomImage mj={mineTake} callPut={readyPutCall} />}
                    </Stack>
                </Stack>
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