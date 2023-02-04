import { GameEventBus } from ".";
import { Area, FindArea } from "./util";

//加入房间
export const memberJoin = (bus: GameEventBus, payload: any) => {
    //查询方位
    const newArea = FindArea(bus.mine.idx, payload.newPlayer.idx)
    bus.setPlayer(newArea, payload.newPlayer)

    //新玩家加入
    bus.getPlayerRef(newArea)?.current.join(newArea, payload.newPlayer)
}

//退出房间
export const memberExit = (bus: GameEventBus, payload: any) => {

}

//游戏开始
export const startGame = (bus: GameEventBus, payload: any) => {
    const mineIdx = bus.mine.idx

    //初始化渲染玩家手牌
    payload.tiles.forEach((item: any) => {
        const itemArea = FindArea(mineIdx, item.idx)
        bus.getPlayerReducer(itemArea)?.setHand(item.hands)
    })

    //渲染当前方位
    const turnArea = FindArea(mineIdx, payload.turnIdx)
    bus.turnRef.current.changeTurn(turnArea)
    //开启计时器
    bus.countdwonRef.current.start(30)
    //剩余牌库
    bus.remainedRef.current.setRemained(payload.remained)

    //非本回合
    if (mineIdx !== payload.turnIdx) { return }

    //延迟触发摸牌事件
    // setTimeout(() => {
    //     //从前摸牌
    //     const mineRedux = bus.getPlayerReducer(Area.Bottom)
    //     mineRedux!.doTake(1)
    // }, 500)
}

export const takePlay = (bus: GameEventBus, payload: any) => {

}

export const putPlay = (bus: GameEventBus, payload: any) => {

}

export const racePlay = (bus: GameEventBus, payload: any) => {

}

export const winPlay = (bus: GameEventBus, payload: any) => {

}

export const skipPlay = (bus: GameEventBus, payload: any) => {

}

export const turnPlay = (bus: GameEventBus, payload: any) => {
    const turnArea = FindArea(bus.mine.idx, payload.who)
    bus.turnRef.current.changeTurn(turnArea)
    bus.countdwonRef.current.start(payload.duration)
}