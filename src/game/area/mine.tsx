import React from "react"
import { Avatar, Divider, Grid, Stack, Typography } from "@mui/material";
import { PlayerContext } from "../context";
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


export const MineAreaContainer: React.FC<{ playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerCtx, take, hands, races }) => {


    let [readyPuts, setReadyPuts] = React.useState<Array<number>>([])

    // 事件
    let readyPutCall = (mj: number, ok: boolean) => {
        if (ok) {
            readyPuts.push(mj)
        } else {
            let idx = readyPuts.indexOf(mj)
            if (idx !== -1) {
                readyPuts.splice(idx, 1)
            }
        }
        setReadyPuts(readyPuts)
    }

    const raceCall = (race: string) => {

        if (race === 'hu') {

        } else if (race === 'peng') {

        } else if (race === 'gang') {

        } else if (race === 'chi') {

        } else {

        }
        debugger
    }

    let raceOptions = ['peng', 'gang', 'chi', 'hu', 'pass']

    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={4} justifyContent={'center'} >
                <RaceArea raceCall={raceCall} races={raceOptions} />
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
                            Array.from(races).map((raceGroup, idx) => (
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
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
                        {
                            Array.from(hands).map((handItem, idx) => (
                                <MjBottomImage mj={handItem} key={idx} callPut={readyPutCall} />
                            ))
                        }
                    </Stack>
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                        <MjBottomImage mj={take} callPut={readyPutCall} />
                    </Stack>
                </Stack>
            </Grid>
            <Grid container item xs={2} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={playerCtx.info} />
            </Grid>
        </Grid>
    )
}