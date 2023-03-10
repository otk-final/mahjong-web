import React, { Ref, useRef, useState, forwardRef, useImperativeHandle, useContext, useEffect } from 'react';
import './index.css';
import { Button, Grid, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { GameEventBus, GameContext } from './context';
import { PlayerContainer } from './area';
import { CenterAreaContainer } from './area/center';
import { MjBottomImage, MjExtra } from '../component/tile';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams } from 'react-router-dom';
import { gameApi, getVisitor, roomApi } from '../api/http';
import { Box } from '@mui/system';
import { NetConnect } from '../api/websocket';
import { LoadingArea, LoadingBus, LoadingContext } from '../component/loading';
import { Area, FindArea } from './context/util';
import { NotifyArea, NotifyBus, NotifyContext } from '../component/alert';
import { GamePloyFilter } from '../assets';

export const GameMainRoute: React.FC = () => {
    const params: any = useParams()
    let [stateContext, setGameContext] = useState<GameEventBus>()
    //loading
    const loadingCtx = useContext<LoadingBus>(LoadingContext)
    const notifyCtx = useContext<NotifyBus>(NotifyContext)

    useEffect(() => {

        const vs = getVisitor()
        if (!vs){
            return notifyCtx.warn("用户信息不存在")
        }
        loadingCtx.show()

        //加入房间
        roomApi.join({ roomId: params.roomId }).then((resp: any) => {

            //长连接
            const netConn = new NetConnect(params.roomId,vs)
            netConn.conn()

            //设置基础成员信息
            const own = resp.data.own
            const roomId = resp.data.roomId
            const players = resp.data.players
            const ployId = resp.data.config.mode

            //初始化
            const ctx = new GameEventBus(roomId, ployId, own)
            players.forEach((item: any) => {
                ctx.setPlayer(FindArea(own.idx, item.idx), item)
            });
            //基础信息
            ctx.bindConnect(netConn)
            ctx.setBegin(resp.data.begin)

            setGameContext(ctx)
            document.title = '玩家：' + own.uname
        }).catch((err: any) => {
            loadingCtx.hide()
            notifyCtx.error(err)
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

    const loadingCtx = useContext<LoadingBus>(LoadingContext)
    const notifyCtx = useContext<NotifyBus>(NotifyContext)
    ctx.bindLoadingCtx(loadingCtx)
    ctx.bindNotifyCtx(notifyCtx)

    useEffect(() => {
        if (!ctx.isBegin()) {
            return
        }
        loadingCtx.show()
        //加载游戏数据
        gameApi.load({ roomId: ctx.roomId }).then((resp: any) => {
            //渲染当前方位
            const turnArea = FindArea(ctx.mine.idx, resp.data.turnIdx)
            ctx.doChangeTurn(turnArea)
            //开启计时器
            ctx.doCountdownReset(resp.data.interval)
            //剩余牌库
            ctx.doUpdateRemained(resp.data.remained)
            ctx.doUpdateMjExtras(resp.data.extras)
            //加载牌
            resp.data.players.forEach((item: any) => {
                const itemArea = FindArea(ctx.mine.idx, item.idx)
                const itemRedux = ctx.getPlayerReducer(itemArea)
                itemRedux?.setTileCollect({ hands: item.hands, races: item.races, take: -1, outs: item.outs })
                ctx.doOutput(itemArea, ...item.outs)
            })

            //方位
            const recentArea = FindArea(ctx.mine.idx, resp.data.recentIdx)
            ctx.doOutLastedChange(recentArea)

            //可用策略
            const raceOptions = resp.data.options.map((item: any) => {
                return item.raceType
            })
            ctx.getPlayerReducer(Area.Bottom)?.getRaceCurrent().updateOptions(raceOptions)

            loadingCtx.hide()
        }).catch(err => {
            loadingCtx.hide()
        })
    }, [])
    return (
        <GameContext.Provider value={ctx}>
            <Grid container justifyContent={'center'}>
                <Grid item container xs={9} direction={'column'} sx={{ height: '100vh', border: '1px dotted green', background: '#1f793b', borderRadius: '50px' }}>
                    <Grid item container xs={2} >
                        <Grid item container xs={2} justifyContent={'center'} alignItems={'center'}>
                            <Stack>
                                <img src={GamePloyFilter(ctx.getGamePolyId())} alt='' style={{ height: '50px' }} />
                                <Typography variant="h6" color="text.secondary">
                                    房间号：{ctx.roomId}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item container xs={8}>
                            <PlayerContainer ref={toperRef} direction={Area.Top} />
                        </Grid>
                        <Grid item container xs={2} justifyContent={'center'} alignItems={'center'} spacing={2}>
                            <ExtraArea ref={extraRef} extras={[]} />
                        </Grid>
                    </Grid>
                    <Grid item xs  >
                        <Grid container sx={{ height: '100%' }}>
                            <Grid item xs={2}>
                                <PlayerContainer ref={lefterRef} direction={Area.Left} />
                            </Grid>
                            <Grid item xs={8} justifyContent={"center"} alignItems={'center'}>
                                <CenterAreaContainer ref={centerRef} />
                            </Grid>
                            <Grid item xs={2}>
                                <PlayerContainer ref={righterRef} direction={Area.Right} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} >
                        <PlayerContainer ref={bottomerRef} direction={Area.Bottom} />
                    </Grid>
                </Grid>
            </Grid >
            <NotifyArea />
            <LoadingArea open={false} />
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
        updateExtras: (extras: Array<MjExtra>) => { setExtras(extras) }
    }))

    gameCtx.bindExtraRef(ref)
    return (<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} >
        {
            Array.from(stateExtras).map((mjItem, idx) => (
                <Grid item key={idx}>
                    <MjBottomImage mj={mjItem.tile} extra={mjItem} />
                </Grid>
            ))
        }
    </Grid>)
})