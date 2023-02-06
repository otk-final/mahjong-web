import React, { useImperativeHandle, useRef, useState, forwardRef, Ref, useContext, useEffect } from "react"
import { GameContext, GameEventBus, PlayerReducer } from '../context';
import { Box, Divider, Grid, Stack } from "@mui/material";
import { MjImage, MjImageHeight } from "../../component/tile";
import { AvatarArea, Player } from "../../component/player";
import { MineAreaContainer } from "./mine";
import { Area } from "../context/util";
import AddIcon from '@mui/icons-material/Add';

const EmptyContainer: React.FC<{ direction: Area }> = ({ direction }) => {
    return (<Stack sx={{ height: '100%' }} justifyContent={'center'} alignItems={'center'}>
        <AddIcon color="disabled" sx={{ fontSize: 80 }}></AddIcon>
    </Stack>)
}


export const PlayerContainer = forwardRef((props: { direction: Area }, ref: Ref<any>) => {


    const gameCtx = useContext<GameEventBus>(GameContext)

    const [stateJoined, setJoined] = useState<{ direction: Area, redux?: PlayerReducer }>(() => {
        //不存在
        let player = gameCtx.getPlayer(props.direction)
        let redux = gameCtx.getPlayerReducer(props.direction)
        if (player) {
            redux = new PlayerReducer(props.direction, player!, ref)
        }
        return {
            direction: props.direction,
            redux: redux,
        }
    })

    useImperativeHandle(ref, () => ({
        join(direction: Area, newPlayer: Player) {
            setJoined({ direction: direction, redux: new PlayerReducer(direction, newPlayer, ref) })
        },
        exit() {
            setJoined({ direction: props.direction, redux: undefined })
        }
    }))

    //bind
    gameCtx.setPlayerRef(props.direction, ref)
    if (stateJoined.redux) { gameCtx.setPlayerReducer(stateJoined.direction, stateJoined.redux) }

    const holdRef = useRef()
    return (
        stateJoined.redux ? <JoinContainer ref={holdRef} redux={stateJoined.redux!} direction={stateJoined.direction} /> : <EmptyContainer direction={props.direction} />
    )
})


const JoinContainer = forwardRef((props: { redux: PlayerReducer, direction: Area }, ref: Ref<any>) => {

    const reduxOps = props.redux
    let [hands, setHands] = useState<Array<number>>(reduxOps.getHand())
    let [races, setRaces] = useState<Array<Array<number>>>(reduxOps.getRaces())
    let [take, setTake] = useState<number>(reduxOps.getTake())
    useImperativeHandle(ref, () => ({
        updateHands(tiles: Array<number>) {
            setHands(tiles)
        },
        updateTake(tile: number) {
            debugger
            setTake(tile)
        },
        appendRace(race: Array<number>){
            debugger
            races.push(race)
            setRaces(races)
        }
    }))
    reduxOps.bindTileRef(ref)

    if (props.direction === Area.Left) {
        return <LeftPlayer redux={reduxOps} take={take} hands={hands} races={races} />
    } else if (props.direction === Area.Right) {
        return <RightPlayer redux={reduxOps} take={take} hands={hands} races={races} />
    } else if (props.direction === Area.Top) {
        return <TopPlayer redux={reduxOps} take={take} hands={hands} races={races} />
    }
    return <MineAreaContainer redux={reduxOps} take={take} hands={hands} races={races} />
})




const LeftPlayer: React.FC<{ redux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ redux, take, hands, races }) => {
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
                <AvatarArea user={redux.player} />
            </Grid>
        </Stack>)
}

const RightPlayer: React.FC<{ redux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ redux, take, hands, races }) => {
    return (
        <Stack alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={3} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={redux.player} />
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

const TopPlayer: React.FC<{ redux: PlayerReducer, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ redux, take, hands, races }) => {
    return (
        <Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
            <Grid container item xs={4} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={redux.player} />
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
