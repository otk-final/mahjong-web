import React, { useEffect, useState } from "react"
import { Area, GameContext, PlayerContext, RoomContext } from '../context';
import { Box, Divider, Grid, Stack } from "@mui/material";
import { MjImage, MjImageHeight } from "../../component/tile";
import { AvatarArea } from "../../component/player";
import { MineAreaContainer } from "./mine";

const EmptyContainer: React.FC<{ roomCtx: RoomContext, gameCtx: GameContext, direction: string }> = ({ direction }) => {
    return (<div>{direction}</div>)
}


export const PlayerContainer: React.FC<{ roomCtx: RoomContext, gameCtx: GameContext, playerCtx?: PlayerContext, direction: string }> = ({ roomCtx, gameCtx, playerCtx, direction }) => {
    if (!playerCtx) {
        return <EmptyContainer roomCtx={roomCtx} gameCtx={gameCtx} direction={direction} />
    }
    return <JoinContainer roomCtx={roomCtx} gameCtx={gameCtx} playerCtx={playerCtx!} />
}




const JoinContainer: React.FC<{ roomCtx: RoomContext, gameCtx: GameContext, playerCtx: PlayerContext }> = ({ roomCtx, gameCtx, playerCtx }) => {


    let [hands, setHands] = useState<Array<number>>(playerCtx.getHand())
    let [races, setRaces] = useState<Array<Array<number>>>(playerCtx.getRaces())
    let [take, setTake] = useState<number>(playerCtx.getTake())
    let [display, setDisplay] = useState<boolean>(playerCtx.getDisplay())


    playerCtx.onHand((tiles: Array<number>) => {
        tiles.sort((a, b) => { return a - b })
        setHands(tiles)
    })

    playerCtx.onTake((direction: number, tile: number) => {
        setTake(tile)
    })

    playerCtx.onPut((tile: number) => {
        if (take !== -1) {
            hands.push(take)
        }
        //不管打出任何牌，将最后摸牌添加到手牌中再进行删除重整
        setTake(-1)

        //删除
        let idx = hands.indexOf(tile)
        hands.splice(idx, 1)

        //重排序
        hands.sort((a, b) => { return a - b })
        setHands(hands)
    })

    playerCtx.onRace((race: Array<number>, who: number, tile: number) => {

        //组合
        race.push(tile)
        race.sort((a, b) => { return a - b })

        races.push(race)
        let whoCtx = gameCtx.Lefter;
        whoCtx!.removeLastedOutput(tile)
    })

    if (playerCtx.area === Area.Left) {
        return <LeftPlayer playerCtx={playerCtx} take={take} hands={hands} races={races} />
    }
    if (playerCtx.area === Area.Right) {
        return <RightPlayer playerCtx={playerCtx} take={take} hands={hands} races={races} />
    }
    if (playerCtx.area === Area.Top) {
        return <TopPlayer playerCtx={playerCtx} take={take} hands={hands} races={races} />
    }
    return <MineAreaContainer playerCtx={playerCtx} take={take} hands={hands} races={races} />
}




const LeftPlayer: React.FC<{ playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerCtx, take, hands, races }) => {
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
                            <MjImage mj={take} direction={'left'} />
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
                <AvatarArea user={playerCtx.info} />
            </Grid>
        </Stack>)
}

const RightPlayer: React.FC<{ playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerCtx, take, hands, races }) => {
    return (
        <Stack alignItems={'center'} sx={{ height: '100%' }}>
            <Grid item container xs={3} justifyContent={'center'} alignItems={'center'}>
                <AvatarArea user={playerCtx.info} />
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
                            <MjImage mj={take} direction={'right'} />
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

const TopPlayer: React.FC<{ playerCtx: PlayerContext, take: number, hands: Array<number>, races: Array<Array<number>> }> = ({ playerCtx, take, hands, races }) => {
    return (<Grid container direction={'column'} alignItems={'center'} sx={{ height: '100%' }}>
        <Grid container item xs={4} justifyContent={'center'} alignItems={'center'}>
            <AvatarArea user={playerCtx.info} />
        </Grid>
        <Grid item container xs={8} justifyContent={'center'} alignItems={'center'} >
            <Stack
                direction={'row'} spacing={3}
                divider={<Divider orientation="vertical" flexItem />}
                alignItems="center"
            >
                {/* take */}
                <Stack direction={'row'}>
                    <MjImage mj={take} direction={'top'} />
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
