import { GameEventBus } from ".";
import { triggerTake } from "../area/mine";
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
    setTimeout(() => {
        //从前摸牌
        const mineRedux = bus.getPlayerReducer(Area.Bottom)
        return triggerTake(bus, mineRedux!, 1)
    }, 500)
}

export const takePlay = (bus: GameEventBus, payload: any) => {
    //忽略自己事件
    const mineIdx = bus.mine.idx
    if (mineIdx === payload.who) {
        return
    }

    const targetArea = FindArea(mineIdx, payload.who)
    bus.getPlayerReducer(targetArea)?.getTileCurrent().updateTake(payload.tile)
}

export const putPlay = (bus: GameEventBus, payload: any) => {

    //清除所有判定效果
    bus.effectRef.current.remove()

    //忽略自己事件
    const mineIdx = bus.mine.idx
    if (mineIdx === payload.who) {
        return
    }
    const targetArea = FindArea(mineIdx, payload.who)
    bus.doOutput(targetArea, payload.tile)
}

export const racePlay = (bus: GameEventBus, payload: any) => {

    //忽略自己事件
    const mineIdx = bus.mine.idx
    if (mineIdx === payload.who) {
        return
    }

    const targetArea = FindArea(mineIdx, payload.who)
    const targetRedux = bus.getPlayerReducer(targetArea)

    //更新目标牌库
    targetRedux?.doRace(payload.tiles)

    //渲染效果
    bus.doRaceby(targetArea, payload.tile)
    bus.doEffect(targetArea, payload.raceType)
}

export const winPlay = (bus: GameEventBus, payload: any) => {

}

export const skipPlay = (bus: GameEventBus, payload: any) => {

}

export const turnPlay = (bus: GameEventBus, payload: any) => {

    //重新开始计时
    const turnArea = FindArea(bus.mine.idx, payload.who)
    bus.turnRef.current.changeTurn(turnArea)
    bus.countdwonRef.current.start(payload.duration)

    //重置当前判定可选项
    const mineRedux = bus.getPlayerReducer(Area.Bottom)
    mineRedux?.getRaceCurrent().removeOptions()

    if (bus.mine.idx === payload.who) {
        return
    }
    //当前回合，延迟触发摸牌
    setTimeout(() => {
        //从前摸牌
        const mineRedux = bus.getPlayerReducer(Area.Bottom)
        return triggerTake(bus, mineRedux!, 1)
    }, 500)
}