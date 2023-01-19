import React from 'react';
import { Player } from '../../component/player';
import { MjExtra } from '../../component/tile';
import { Area } from './util';




// 游戏
export class GameEventBus {

    // 玩家
    Lefter?: PlayerReducer
    Righter?: PlayerReducer;
    Toper?: PlayerReducer;
    Bottomer?: PlayerReducer;

    //房间信息
    roomId: string
    round: number
    constructor(roomId: string, round: number) {
        this.roomId = roomId
        this.round = round
    }


    join(area: Area, member: Player) {
        const memberCtx = new PlayerReducer(area, member)
        switch (area) {
            case Area.Left: this.Lefter = memberCtx; break
            case Area.Right: this.Righter = memberCtx; break
            case Area.Bottom: this.Bottomer = memberCtx; break
            case Area.Top: this.Toper = memberCtx; break
        }
    }

    centerRef: any
    bindCenterRef(ref: any) {
        this.centerRef = ref
    }
    effectRef: any
    bindEffectRef(ref: any) {
        this.effectRef = ref
    }
    turnRef: any
    bindTurnRef(ref: any) {
        this.turnRef = ref
    }
    countdwonRef: any
    bindCountdownRef(ref: any) {
        this.countdwonRef = ref
    }
    remainedRef: any
    bindRemainedRef(ref: any) {
        this.remainedRef = ref
    }

    //开始游戏
    start() {

    }

    //游戏结束
    finish() {

    }

    mjExtras: Array<MjExtra> = []
    setMjExtras(extras: Array<MjExtra>) {
        this.mjExtras = extras
    }

    getMjExtra(mj: number): MjExtra | undefined {
        let find = this.mjExtras.filter((item: any) => {
            return item.tile === mj
        })
        return find && find.length === 1 ? find[0] : undefined
    }
}

// 玩家
export class PlayerReducer {

    area: Area
    info: Player

    constructor(area: Area, info: Player) {
        this.area = area
        this.info = info
    }

    getHand(): Array<number> {
        if (this.area !== Area.Bottom) {
            return [0, 0, 0, 0, 0]
        }
        return [2, 45, 4, 12, 35, 25]
    }
    getTake(): number {
        return -1
    }
    getRaces(): Array<Array<number>> {
        if (this.area !== Area.Bottom) {
            return [[1, 2, 3], [11, 12, 13], [21, 22, 23], [17, 18, 19]]
        }
        return []
    }
    getDisplay(): boolean {
        return false
    }

    getOuts(): Array<number> {
        return [1, 2, 3, 12, 3]
    }
}



const emptyGameContext = new GameEventBus('empty', 0)

export const GameContext = React.createContext<GameEventBus>(emptyGameContext)
