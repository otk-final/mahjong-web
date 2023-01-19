import * as React from 'react';
import './index.css';
import { Grid } from "@mui/material";
import { GameEventBus, GameContext } from './context';
import { NetConnect } from './context/websocket';
import { PlayerContainer } from './area';
import { CenterAreaContainer } from './area/center';
import { MjBottomImage, MjExtra } from '../component/tile';
import { FindArea } from './context/util';


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
        mjExtras: [{
            text: '朝',
            tile: 2
        }, {
            text: '鬼',
            tile: 45
        }]
    }

    let centerRef = React.useRef()



    //当局上下文
    let contextBus = new GameEventBus(roomId, round)
    contextBus.setMjExtras(resp.mjExtras)

    resp.members.forEach((item: any) => {
        let mainArea = FindArea(resp.mine.pIdx, item.pIdx)
        contextBus.join(mainArea, item)
    })


    //状态
    let [netOk, setNetOk] = React.useState(false)
    let [joined, setJoined] = React.useState({ left: false, right: false, top: false, bottom: false })
    let [mjExtras, setMjExtras] = React.useState<Array<MjExtra>>(resp.mjExtras)


    //长连接
    // React.useMemo(() => {
    //     //连接ws
    //     let netConn = new NetConnect(gameCtx, setNetOk)
    //     netConn.start(roomId)

    //     return () => netConn.destory()
    // }, [netOk])


    let sx = { height: '100vh', border: '1px dotted green', background: '#1f793b', borderRadius: '50px' }


    // 玩家
    let lefter = contextBus.Lefter!
    let righter = contextBus.Righter!;
    let toper = contextBus.Toper!;
    let bottomer = contextBus.Bottomer!;

    return (
        <GameContext.Provider value={contextBus}>
            <Grid className='App' container justifyContent={'center'}>
                <Grid item container xs={9} direction={'column'} sx={sx}>
                    <Grid item container xs={2} >
                        <Grid item container xs={2} justifyContent={'center'} alignItems={'center'}>
                            exit
                        </Grid>
                        <Grid item xs={8}>
                            <PlayerContainer playerRedux={toper} direction='top' />
                        </Grid>

                        <Grid item container xs={2} justifyContent={'center'} alignItems={'center'} spacing={2}>
                            {
                                Array.from(mjExtras).map((mjItem, idx) => (
                                    <Grid item key={idx}>
                                        <MjBottomImage mj={mjItem.tile} extra={mjItem} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs  >
                        <Grid container sx={{ height: '100%' }}>
                            <Grid item xs={2.5}>
                                <PlayerContainer playerRedux={lefter} direction='left' />
                            </Grid>
                            <Grid item xs={7} justifyContent={"center"} alignItems={'center'}>
                                <CenterAreaContainer ref={centerRef} />
                            </Grid>
                            <Grid item xs={2.5}>
                                <PlayerContainer playerRedux={righter} direction='right' />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} >
                        <PlayerContainer playerRedux={bottomer} direction='bottom' />
                    </Grid>
                </Grid>
            </Grid >
        </GameContext.Provider>
    )
}


