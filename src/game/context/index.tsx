import React from 'react';
import { Player } from '../../component/player';
import { MjExtra } from '../../component/tile';
import { Area } from './util';
import { NetConnect } from '../../api/websocket';
import { memberExit, memberJoin, putPlay, racePlay, skipPlay, startGame, takePlay, turnPlay, winPlay } from './consumer';


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
    extraRef: any
    bindExtraRef(ref: any) {
        this.extraRef = ref
    }

    doEffect(area: Area, race: string) {
        this.effectRef.current.append(area, race)
    }

    doOutput(area: Area, ...tiles: number[]) {
        this.centerRef.current.output(area, ...tiles)
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

    bindConnect(conn: NetConnect) {
        //玩家加入
        conn.subscribe(100, (payload: any) => { memberJoin(this, payload) })
        //玩家退出
        conn.subscribe(101, (payload: any) => { memberExit(this, payload) })
        //游戏开始
        conn.subscribe(102, (payload: any) => { startGame(this, payload) })
        //摸牌
        conn.subscribe(103, (payload: any) => { takePlay(this, payload) })
        //出牌
        conn.subscribe(104, (payload: any) => { putPlay(this, payload) })
        //判断
        conn.subscribe(105, (payload: any) => { racePlay(this, payload) })
        //胡牌
        conn.subscribe(106, (payload: any) => { winPlay(this, payload) })
        //忽略
        conn.subscribe(107, (payload: any) => { skipPlay(this, payload) })
        //回合
        conn.subscribe(108, (payload: any) => { turnPlay(this, payload) })
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
            return []
        }
        return []
    }
    getTake(): number {
        return -1
    }
    getRaces(): Array<Array<number>> {
        if (this.area !== Area.Bottom) {
            return []
        }
        return []
    }
    getDisplay(): boolean {
        return false
    }

    getOuts(): Array<number> {
        return []
    }
}



const emptyGameContext = new GameEventBus('empty', 0)

export const GameContext = React.createContext<GameEventBus>(emptyGameContext)
