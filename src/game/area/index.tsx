import React, { useState } from "react"
import { PlayerReducer } from '../context';
import { Box, Divider, Grid, Stack } from "@mui/material";
import { MjImage, MjImageHeight } from "../../component/tile";
import { AvatarArea } from "../../component/player";
import { MineAreaContainer } from "./mine";
import { Area } from "../context/util";
import AddIcon from '@mui/icons-material/Add';

const EmptyContainer: React.FC<{ direction: string }> = ({ direction }) => {
    return (<Stack sx={{ height: '100%' }} justifyContent={'center'} alignItems={'center'}>
        <AddIcon color="disabled" sx={{ fontSize: 80 }}></AddIcon>
    </Stack>)
}


export const PlayerContainer: React.FC<{ playerRedux: PlayerReducer, direction: string }> = ({ playerRedux, direction }) => {
    if (!playerRedux) {
        return <EmptyContainer direction={direction} />
    }
    return <JoinContainer playerRedux={playerRedux!} />
}




const JoinContainer: React.FC<{ playerRedux: PlayerReducer }> = ({ playerRedux }) => {


    let [hands, setHands] = useState<Array<number>>(playerRedux.getHand())
    let [races, setRaces] = useState<Array<Array<number>>>(playerRedux.getRaces())
    let [take, setTake] = useState<number>(playerRedux.getTake())
    let [display, setDisplay] = useState<boolean>(playerRedux.getDisplay())


    if (playerRedux.area === Area.Left) {
        return <LeftPlayer playerRedux={playerRedux} take={take} hands={hands} races={races} />
    }
    if (playerRedux.area === Area.Right) {
        return <RightPlayer playerRedux={playerRedux} take={take} hands={hands} races={races} />
    }
    if (playerRedux.area === Area.Top) {
        return <TopPlayer playerRedux={playerRedux} take={take} hands={hands} races={races} />
    }

    //当前玩家
    return <MineAreaContainer playerRedux={playerRedux} take={take} hands={hands} races={races} />
}




const LeftPlayer: React.FC<{ playerRedux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerRedux, take, hands, races }) => {
    return (
        <Stack alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={9} alignItems={'center'}>
                <Grid item container xs={6} justifyContent={'center'} alignItems={'center'} >
                    <Stack
                        spacing={1}
                        divider={<Divider orientation={'horizontal'} flexItem />}
                        alignItems="center"
                    >
                        {/* hands */}
                        <Stack>
                            {
                                Array.from(hands).map((handItem, idx) => (
                                    <Box key={idx} sx={{ height: MjImageHeight.leftRotate }} >
                                        <MjImage mj={handItem} direction={'left'} />
                                    </Box>
                                ))
                            }
                        </Stack>
                        {/* take */}
                        <Stack>
                            {take !== -1 && <MjImage mj={take} direction={'left'} />}
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item container xs={6} justifyContent={'center'} sx={{ position: 'relative' }}>
                    {/* races */}
                    <Stack spacing={1} >
                        {
                            Array.from(races).map((raceGroup, idx) => (
                                <Stack key={idx}>
                                    {
                                        Array.from(raceGroup).map((raceItem, idx) => (
                                            <Box key={idx} sx={{ height: MjImageHeight.leftRotate }} >
                                                <MjImage mj={raceItem} direction={'left'} />
                                            </Box>
                                        ))
                                    }
                                </Stack>
                            ))
                        }
                    </Stack>
                </Grid>
            </Grid>
            <Grid item container xs={3} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={playerRedux.info} />
            </Grid>
        </Stack>)
}

const RightPlayer: React.FC<{ playerRedux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerRedux, take, hands, races }) => {
    return (
        <Stack alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={3} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={playerRedux.info} />
            </Grid>
            <Grid item container xs={9} justifyContent={'center'} alignItems={'center'} >
                <Grid item container xs={6} justifyContent={'center'} alignItems={'center'}>
                    {/* races */}
                    <Stack spacing={1} >
                        {
                            Array.from(races).map((raceGroup, idx) => (
                                <Stack key={idx}>
                                    {
                                        Array.from(raceGroup).map((raceItem, idx) => (
                                            <Box key={idx} sx={{ height: MjImageHeight.rightRotate }} >
                                                <MjImage mj={raceItem} direction={'right'} />
                                            </Box>
                                        ))
                                    }
                                </Stack>
                            ))
                        }
                    </Stack>
                </Grid>
                <Grid item container xs={6} justifyContent={'center'} alignItems={'center'} >
                    <Stack
                        spacing={3}
                        divider={<Divider orientation={'horizontal'} flexItem />}
                        alignItems="center"
                    >
                        {/* take */}
                        <Stack justifyContent={'center'} alignItems={'center'}>
                            {take !== -1 && <MjImage mj={take} direction={'right'} />}
                        </Stack>
                        {/* hands */}
                        <Stack spacing={0.1} >
                            {
                                Array.from(hands).map((handItem, idx) => (
                                    <Box key={idx} sx={{ height: MjImageHeight.rightRotate }} >
                                        <MjImage mj={handItem} direction={'right'} />
                                    </Box>
                                ))
                            }
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>)
}

const TopPlayer: React.FC<{ playerRedux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerRedux, take, hands, races }) => {
    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid container item xs={4} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={playerRedux.info} />
            </Grid>
            <Grid item container xs={8} justifyContent={'center'} alignItems={'center'} >
                <Stack
                    direction={'row'} spacing={3}
                    divider={<Divider orientation="vertical" flexItem />}
                    alignItems="center"
                >
                    {/* take */}
                    <Stack direction={'row'}>
                        {take !== -1 && <MjImage mj={take} direction={'top'} />}
                    </Stack>
                    {/* hands */}
                    <Stack direction={'row'} spacing={0.5} >
                        {
                            Array.from(hands).map((handItem, idx) => (
                                <MjImage mj={handItem} direction={'top'} key={idx} />
                            ))
                        }
                    </Stack>
                    {/* races */}
                    <Stack direction={'row'} spacing={1} >
                        {
                            Array.from(races).map((raceGroup, idx) => (
                                <Stack direction={'row'} key={idx} spacing={0.3}>
                                    {
                                        Array.from(raceGroup).map((raceItem, idx) => (
                                            <MjImage mj={raceItem} direction={'top'} key={idx} />
                                        ))
                                    }
                                </Stack>
                            ))
                        }
                    </Stack>
                </Stack>
            </Grid>
        </Grid>)
}
