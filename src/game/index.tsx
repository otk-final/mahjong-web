import React, { Ref, useEffect, useRef, useState, forwardRef, useImperativeHandle, useContext } from 'react';
import './index.css';
import { Button, Grid, SwipeableDrawer } from "@mui/material";
import { GameEventBus, GameContext } from './context';
import { PlayerContainer } from './area';
import { CenterAreaContainer } from './area/center';
import { MjBottomImage, MjExtra } from '../component/tile';
import { FindArea } from './context/util';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams } from 'react-router-dom';
import { MockAuthor, roomProxy } from '../api/http';
import { Box } from '@mui/system';
import { NetConnect } from '../api/websocket';

export const GameMainRoute: React.FC = () => {
    const params: any = useParams()
    return (<GameMainArea roomId={params.roomId} playerId={params.playerId} round={0} />)
}

export const GameMainArea: React.FC<{ roomId: string, playerId: string, round: number }> = ({ roomId, playerId, round }) => {


    useEffect(() => {
        console.info("init")
    })


    // 模拟数据
    const minePlayer = {
        pIdx: 0,
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
            pIdx: 1,
            name: "玩家1",
            ip: "192.168.1.34",
            status: "user"
        }
    ]

    var resp = {
        mine: minePlayer,
        members: members
    }

    let centerRef = useRef()
    let extraRef = useRef()


    //当局上下文
    let contextBus = new GameEventBus(roomId, round)


    //加入房间
    roomProxy(playerId).join({ roomId: roomId }).then((resp: any) => {
        // debugger

    }).catch((err: any) => {
        // debugger
    })


    //长连接
    let netAuthor = MockAuthor(playerId)
    let netConn = new NetConnect(netAuthor)
    netConn.onerror((err: any) => {
        netConn.retry(3)
    })

    
    netConn.conn("ws://localhost:7070/ws/" + roomId)
    contextBus.bindConnect(netConn)


    resp.members.forEach((item: any) => {
        let mainArea = FindArea(resp.mine.pIdx, item.pIdx)
        contextBus.join(mainArea, item)
    })


    // 玩家
    let lefter = contextBus.Lefter!
    let righter = contextBus.Righter!;
    let toper = contextBus.Toper!;
    let bottomer = contextBus.Bottomer!;

    return (
        <GameContext.Provider value={contextBus}>
            <Grid className='App' container justifyContent={'center'}>
                <Grid item container xs={1.5} justifyContent={'flex-start'} alignItems="center">
                    <RankDrawer />
                </Grid>
                <Grid item container xs={9} direction={'column'} sx={{ height: '100vh', border: '1px dotted green', background: '#1f793b', borderRadius: '50px' }}>
                    <Grid item container xs={2} >
                        <Grid item container xs={2} spacing={2} justifyContent={'center'} alignItems={'center'}>
                            <Button variant="contained" startIcon={<ExitToAppIcon />} color="primary" size="small">退出游戏</Button>
                        </Grid>
                        <Grid item xs={8}>
                            <PlayerContainer playerRedux={toper} direction='top' />
                        </Grid>
                        <Grid item container xs={2} justifyContent={'center'} alignItems={'center'} spacing={2}>
                            <ExtraArea ref={extraRef} extras={[]} />
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
                <Grid item container xs={1.5} justifyContent={'flex-end'} alignItems="center">
                    <ChatDrawer />
                </Grid>
            </Grid >
        </GameContext.Provider>
    )
}


const RankDrawer = () => {
    //侧边栏
    const [stateOpen, setDrawer] = React.useState(false);
    const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawer(open);
    };
    return (<Box>
        <Button variant="contained" endIcon={<ScoreboardIcon />} color="secondary" size="small"
            onClick={toggleDrawer('left', true)}
        >积<br />分<br />榜</Button>

        <SwipeableDrawer
            anchor={'left'}
            open={stateOpen}
            onClose={toggleDrawer('left', false)}
            onOpen={toggleDrawer('left', true)}
        >
            积分
        </SwipeableDrawer>
    </Box>)
}

const ChatDrawer = () => {

    //侧边栏
    const [stateOpen, setDrawer] = React.useState(false);
    const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawer(open);
    };

    return (<Box>
        <Button variant="contained" startIcon={<ChatIcon />} color="inherit" size="small"
            onClick={toggleDrawer('right', true)}>聊<br />天<br />室</Button>
        <SwipeableDrawer
            anchor={'right'}
            open={stateOpen}
            onClose={toggleDrawer('right', false)}
            onOpen={toggleDrawer('right', true)}
        >
            聊天
        </SwipeableDrawer>
    </Box>)
}

const ExtraArea = forwardRef((props: { extras: Array<MjExtra> }, ref: Ref<any>) => {

    const gameCtx = useContext<GameEventBus>(GameContext)
    const [stateExtras, setExtras] = useState<Array<MjExtra>>(props.extras)

    useImperativeHandle(ref, () => ({
        renderExtras: (mj: Array<MjExtra>) => {
            setExtras(mj)
        }
    }))

    gameCtx.bindExtraRef(ref)
    return (<Box>
        {
            Array.from(stateExtras).map((mjItem, idx) => (
                <Grid item key={idx}>
                    <MjBottomImage mj={mjItem.tile} extra={mjItem} />
                </Grid>
            ))
        }
    </Box>)
})