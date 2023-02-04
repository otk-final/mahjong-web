import React, { Ref, useRef, useState, forwardRef, useImperativeHandle, useContext, useEffect } from 'react';
import './index.css';
import { Button, Grid, SwipeableDrawer } from "@mui/material";
import { GameEventBus, GameContext } from './context';
import { PlayerContainer } from './area';
import { CenterAreaContainer } from './area/center';
import { MjBottomImage, MjExtra } from '../component/tile';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams } from 'react-router-dom';
import { FilterAuthor, roomProxy } from '../api/http';
import { Box } from '@mui/system';
import { NetConnect } from '../api/websocket';
import { LoadingArea, LoadingBus, LoadingContext } from '../component/loading';
import { Area, FindArea } from './context/util';

export const GameMainRoute: React.FC = () => {
    const params: any = useParams()
    let [stateContext, setGameContext] = useState<GameEventBus>()
    //loading
    const loadingCtx = useContext<LoadingBus>(LoadingContext)
    // 模拟数据
    const ownAuthor = FilterAuthor(params.playerId)

    useEffect(() => {
        //加入房间
        roomProxy(params.playerId).join({ roomId: params.roomId }).then((resp: any) => {
            //设置基础成员信息
            const own = resp.data.own
            const players = resp.data.players

            //初始化
            const ctx = new GameEventBus(params.roomId, 0, own)
            players.forEach((item: any) => {
                ctx.setPlayer(FindArea(own.idx, item.idx), item)
            });
            //长连接
            const netConn = new NetConnect(ownAuthor)
            netConn.conn("ws://localhost:7070/ws/" + params.roomId)
            ctx.bindConnect(netConn)

            setGameContext(ctx)

            document.title = '玩家：' + own.uname
        }).catch((err: any) => {
            loadingCtx.hide()
        })
    }, [])

    return (
        <React.Fragment>
            {stateContext ? <GameMainArea ctx={stateContext!} /> : <LoadingArea open={true} />}
        </React.Fragment>)
}



const GameMainArea: React.FC<{ ctx: GameEventBus }> = ({ ctx }) => {

    let centerRef = useRef()
    let extraRef = useRef()

    // 玩家
    let lefterRef = useRef()
    let righterRef = useRef()
    let toperRef = useRef()
    let bottomerRef = useRef()

    return (
        <GameContext.Provider value={ctx}>
            <Grid className='App' container justifyContent={'center'}>
                <Grid item container xs={1.5} justifyContent={'flex-start'} alignItems="center">
                    <RankDrawer />
                </Grid>
                <Grid item container xs={9} direction={'column'} sx={{ height: '100vh', border: '1px dotted green', background: '#1f793b', borderRadius: '50px' }}>
                    <Grid item container xs={2} >
                        <Grid item container xs={2} spacing={2} justifyContent={'center'} alignItems={'center'}>
                            
                        </Grid>
                        <Grid item xs={8}>
                            <PlayerContainer ref={toperRef} direction={Area.Top} />
                        </Grid>
                        <Grid item container xs={2} justifyContent={'center'} alignItems={'center'} spacing={2}>
                            <ExtraArea ref={extraRef} extras={[]} />
                        </Grid>
                    </Grid>
                    <Grid item xs  >
                        <Grid container sx={{ height: '100%' }}>
                            <Grid item xs={2.5}>
                                <PlayerContainer ref={lefterRef} direction={Area.Left} />
                            </Grid>
                            <Grid item xs={7} justifyContent={"center"} alignItems={'center'}>
                                <CenterAreaContainer ref={centerRef} />
                            </Grid>
                            <Grid item xs={2.5}>
                                <PlayerContainer ref={righterRef} direction={Area.Right} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} >
                        <PlayerContainer ref={bottomerRef} direction={Area.Bottom} />
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
        renderExtras: (mj: Array<MjExtra>) => { setExtras(mj) }
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