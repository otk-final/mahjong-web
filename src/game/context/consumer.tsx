import { GameEventBus } from ".";
import { triggerRacePre, triggerTake } from "../area/mine";
import { Area, FindArea } from "./util";

const awitTime: number = 300

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
    payload.players.forEach((item: any) => {
        const itemArea = FindArea(mineIdx, item.idx)
        bus.getPlayerReducer(itemArea)?.setTileCollect({ hands: item.hands, races: item.races, take: -1, outs: item.outs })
    })


    //渲染当前方位
    const turnArea = FindArea(mineIdx, payload.turnIdx)
    bus.doChangeTurn(turnArea)
    //开启计时器
    bus.doCountdownReset(payload.interval)
    //剩余牌库
    bus.doUpdateRemained(payload.remained)
    //特殊牌
    bus.doUpdateMjExtras(payload.extras)

    //非本回合
    if (mineIdx !== payload.turnIdx) { return }

    //延迟触发摸牌事件
    setTimeout(() => {
        //从前摸牌
        const mineRedux = bus.getPlayerReducer(Area.Bottom)
        return triggerTake(bus, mineRedux!, 1)
    }, awitTime)
}

export const takePlay = (bus: GameEventBus, payload: any) => {
    //忽略自己事件
    const mineIdx = bus.mine.idx
    if (mineIdx === payload.who) {
        return
    }

    //更新剩余牌数
    bus.doUpdateRemained(payload.remained)
    const targetArea = FindArea(mineIdx, payload.who)
    bus.getPlayerReducer(targetArea)?.doTake(payload.tile)
}

export const putPlay = (bus: GameEventBus, payload: any) => {

    //清除所有判定效果
    bus.doRemoveEffect()

    //忽略自己事件
    const mineIdx = bus.mine.idx
    if (mineIdx === payload.who) {
        return
    }

    //渲染页面
    const targetArea = FindArea(mineIdx, payload.who)
    const targetRedux = bus.getPlayerReducer(targetArea)

    bus.doOutputAndLasted(targetArea, payload.tile)
    targetRedux?.doPut(payload.tile)

    //触发判定
    setTimeout(() => {
        const mineRedux = bus.getPlayerReducer(Area.Bottom)
        return triggerRacePre(bus, mineRedux!, payload.ackId)
    }, awitTime)
}


export const racePlay = (bus: GameEventBus, payload: any) => {

    const mineIdx = bus.mine.idx
    const whoArea = FindArea(mineIdx, payload.who)

    //重新开始计时
    bus.doChangeTurn(whoArea)
    bus.doCountdownReset(payload.interval)


    //忽略自己事件
    if (mineIdx === payload.who) {
        return
    }

    //源
    const whoRedux = bus.getPlayerReducer(whoArea)
    whoRedux?.doRace(payload.raceType, payload.tiles)

    //目标
    const targetArea = FindArea(mineIdx, payload.target)

    //渲染效果
    bus.doEffect(whoArea, payload.raceType)
    bus.doRaceby(targetArea, payload.tile)
}


export const winPlay = (bus: GameEventBus, payload: any) => {

    const mineIdx = bus.mine.idx
    const whoArea = FindArea(mineIdx, payload.who)

    //忽略自己事件
    if (mineIdx === payload.who) {
        return
    }

    //源
    const whoRedux = bus.getPlayerReducer(whoArea)
    whoRedux?.setTileCollect({ hands: payload.tiles.hands, races: payload.tiles.races, take: -1, outs: payload.tiles.outs })

    //渲染效果
    bus.doEffect(whoArea, payload.effect)
}

export const skipPlay = (bus: GameEventBus, payload: any) => {

}

export const turnPlay = (bus: GameEventBus, payload: any) => {

    //重新开始计时
    const turnArea = FindArea(bus.mine.idx, payload.who)
    bus.doChangeTurn(turnArea)
    bus.doCountdownReset(payload.interval)


    //重置当前判定可选项
    const mineRedux = bus.getPlayerReducer(Area.Bottom)
    mineRedux?.getRaceCurrent().removeOptions()

    //非本回合
    if (bus.mine.idx !== payload.who) { return }

    //自己回合，触发摸牌操作
    setTimeout(() => {
        //从前摸牌
        const mineRedux = bus.getPlayerReducer(Area.Bottom)
        return triggerTake(bus, mineRedux!, 1)
    }, awitTime)
}