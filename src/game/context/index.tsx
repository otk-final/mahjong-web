import React, { Ref } from 'react';
import { EmptyPlayer, Player } from '../../component/player';
import { MjExtra } from '../../component/tile';
import { Area, FindArea } from './util';
import { NetConnect } from '../../api/websocket';
import { memberExit, memberJoin, putPlay, racePlay, skipPlay, startGame, takePlay, turnPlay, winPlay } from './consumer';


// 游戏
export class GameEventBus {

    // 玩家
    Lefter?: Player
    Righter?: Player
    Toper?: Player
    Bottomer?: Player


    LefterRef: any
    RighterRef: any
    ToperRef: any
    BottomerRef: any

    //房间信息
    roomId: string
    round: number
    mine: Player
    constructor(roomId: string, round: number, mine: Player) {
        this.roomId = roomId
        this.round = round
        this.mine = mine
    }

    join(area: Area, member: Player) {
        switch (area) {
            case Area.Left: this.Lefter = member; break
            case Area.Right: this.Righter = member; break
            case Area.Bottom: this.Bottomer = member; break
            case Area.Top: this.Toper = member; break
        }
    }

    bindPlayerRef(area: Area, ref: any) {
        switch (area) {
            case Area.Left: this.LefterRef = ref; break
            case Area.Right: this.RighterRef = ref; break
            case Area.Bottom: this.BottomerRef = ref; break
            case Area.Top: this.ToperRef = ref; break
        }
    }

    getPlayerRef(area: Area) {
        switch (area) {
            case Area.Left: return this.LefterRef;
            case Area.Right: return this.RighterRef;
            case Area.Bottom: return this.BottomerRef;
            case Area.Top: return this.ToperRef;
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
    player: Player
    constructor(area: Area, player: Player) {
        this.area = area
        this.player = player
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

    reducerRef: any
    bindRef(ref: any) {
        this.reducerRef = ref
    }
}



const emptyGameContext = new GameEventBus('empty', 0, EmptyPlayer)
export const GameContext = React.createContext<GameEventBus>(emptyGameContext)
