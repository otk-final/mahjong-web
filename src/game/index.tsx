import * as React from 'react';
import './index.css';
import { Grid } from "@mui/material";
import { FindArea, GameContext, RoomContext } from './context';
import { NetConnect } from './context/websocket';
import { PlayerContainer } from './area';
import { CenterAreaContainer } from './area/center';
import { MjBottomImage, MjExtra } from '../component/tile';



export const GameMainArea: React.FC<{ roomId: string, round: number }> = ({ roomId, round }) => {



    // 模拟数据
    const minePlayer = {
        pIdx: 3,
        name: "我",
        ip: "192.168.1.34",
        status: "user"
    }

    const members = [minePlayer,
        {
            pIdx: 0,
            name: "玩家0",
            ip: "192.168.1.34",
            status: "user"
        }, {
            pIdx: 2,
            name: "玩家2",
            ip: "192.168.1.34",
            status: "user"
        }, {
            pIdx: 1,
            name: "玩家1",
            ip: "192.168.1.34",
            status: "user"
        }]

    var resp = {
        mine: minePlayer,
        members: members,
        turnTime: 30,
        turnIdx: -1,
        mjExtra: [{
            text: '朝',
            color: 'secondary',
            tile: 2
        }, {
            text: '鬼',
            color: 'error',
            tile: 45
        }]
    }





    //当局上下文
    let roomCtx = new RoomContext(roomId, round)
    let defaultGameCtx = new GameContext(roomCtx)


    resp.members.forEach((item: any) => {
        let mainArea = FindArea(resp.mine.pIdx, item.pIdx)
        defaultGameCtx.join(mainArea, item)
    })


    //状态
    let [netOk, setNetOk] = React.useState(false)
    let [joined, setJoined] = React.useState({ left: false, right: false, top: false, bottom: false })
    let [mjExtra, setMjExtra] = React.useState<Array<MjExtra>>(resp.mjExtra)
    let [gameCtx, setGameCtx] = React.useState(defaultGameCtx)



    //长连接
    // React.useMemo(() => {
    //     //连接ws
    //     let netConn = new NetConnect(gameCtx, setNetOk)
    //     netConn.start(roomId)

    //     return () => netConn.destory()
    // }, [netOk])


    let sx = { height: '100vh', border: '1px dotted green', background: '#1f793b', borderRadius: '50px' }


    // 玩家
    let lefter = gameCtx.Lefter
    let righter = gameCtx.Righter;
    let toper = gameCtx.Toper;
    let bottomer = gameCtx.Bottomer;


    return (
        <Grid className='App' container justifyContent={'center'}>
            <Grid item container xs={9} direction={'column'} sx={sx}>
                <Grid item container xs={2} >
                    <Grid item container xs={2} justifyContent={'center'} alignItems={'center'}>
                        exit
                    </Grid>
                    <Grid item xs={8}>
                        <PlayerContainer roomCtx={roomCtx} gameCtx={gameCtx} playerCtx={toper} direction='top' />
                    </Grid>

                    <Grid item container xs={2} justifyContent={'center'} alignItems={'center'} spacing={2}>
                        {
                            Array.from(mjExtra).map((mjItem, idx) => (
                                <Grid item key={idx}>
                                    <MjBottomImage mj={mjItem.tile} extra={mjItem}  />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
                <Grid item xs  >
                    <Grid container sx={{ height: '100%' }}>
                        <Grid item xs={2.5}>
                            <PlayerContainer roomCtx={roomCtx} gameCtx={gameCtx} playerCtx={lefter} direction='left' />
                        </Grid>
                        <Grid item xs={7} justifyContent={"center"} alignItems={'center'}>
                            <CenterAreaContainer roomCtx={roomCtx} gameCtx={gameCtx} />
                        </Grid>
                        <Grid item xs={2.5}>
                            <PlayerContainer roomCtx={roomCtx} gameCtx={gameCtx} playerCtx={righter} direction='right' />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} >
                    <PlayerContainer roomCtx={roomCtx} gameCtx={gameCtx} playerCtx={bottomer} direction='bottom' />
                </Grid>
            </Grid>
        </Grid >
    )
}


