import React, { Ref } from 'react';
import { EmptyPlayer, Player } from '../../component/player';
import { MjExtra } from '../../component/tile';
import { Area, FindArea } from './util';
import { NetConnect } from '../../api/websocket';
import { memberExit, memberJoin, putPlay, racePlay, skipPlay, startGame, takePlay, turnPlay, winPlay } from './consumer';
import { gameProxy } from '../../api/http';
import { LoadingBus } from '../../component/loading';
import { NotifyBus } from '../../component/alert';


// 游戏
export class GameEventBus {

    playerMap: Map<Area, Player> = new Map()
    refMap: Map<Area, PlayerReducer> = new Map()
    reduxMap: Map<Area, PlayerReducer> = new Map()

    //房间信息
    roomId: string
    round: number
    mine: Player
    constructor(roomId: string, round: number, mine: Player) {
        this.roomId = roomId
        this.round = round
        this.mine = mine
    }
    setPlayer(area: Area, member: Player) {
        this.playerMap.set(area, member)
    }
    getPlayer(area: Area): Player | undefined {
        return this.playerMap.get(area)
    }
    setPlayerRef(area: Area, ref: any) {
        this.refMap.set(area, ref)
    }
    getPlayerRef(area: Area): any | undefined {
        return this.refMap.get(area)
    }
    setPlayerReducer(area: Area, redux: PlayerReducer) {
        this.reduxMap.set(area, redux)
    }
    getPlayerReducer(area: Area): PlayerReducer | undefined {
        return this.reduxMap.get(area)
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
        //延迟
        this.effectRef.current.append(area, race)
        setTimeout(() => {
            this.removeEffect()
        }, 2000)
    }
    removeEffect() {
        this.effectRef.current.remove()
    }

    doOutput(area: Area, ...tiles: number[]) {
        this.centerRef.current.output(area, ...tiles)
    }

    loadingCtx?: LoadingBus
    notifyCtx?: NotifyBus
    bindLoadingCtx(ctx: LoadingBus) {
        this.loadingCtx = ctx
    }
    bindNotifyCtx(ctx: NotifyBus) {
        this.notifyCtx = ctx
    }

    //开始游戏
    start() {
        gameProxy(this.mine.uid).start({ roomId: this.roomId }).then((resp) => {
            console.info(resp)
        }).catch((err) => {

        })
    }

    //退出游戏
    exit() {
        debugger
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
    holdRef: any
    areaRef: any
    constructor(area: Area, player: Player, areaRef: any) {
        this.area = area
        this.player = player
        this.areaRef = areaRef
    }

    getAreaRefCurrent(): any {
        return this.areaRef.current
    }
    getHoldRefCurrent(): any {
        return this.holdRef.current
    }
    bindHoldRef(ref: any) {
        this.holdRef = ref
    }


    hands: Array<number> = new Array<number>()
    take: number = -1
    races: Array<Array<number>> = new Array<Array<number>>()
    
    display: boolean = false
    outs: Array<number> = new Array<number>()
    outLasted:boolean = false
    setHand(tiles: Array<number>) {
        this.hands = tiles
        this.getHoldRefCurrent().updateHands(tiles)
    }
    isLastedOuput(): boolean {
        return this.outLasted
    }
    getHand(): Array<number> {
        return this.hands
    }
    getTake(): number {
        return this.take
    }
    getRaces(): Array<Array<number>> {
        return this.races
    }
    getDisplay(): boolean {
        return this.display
    }
    getOuts(): Array<number> {
        return this.outs
    }
    //摸牌
    doTake(tile: number) {
        this.take = tile
    }
    doRace(tiles: Array<number>) {
        this.races.push(tiles)
    }
}



const emptyGameContext = new GameEventBus('empty', 0, EmptyPlayer)
export const GameContext = React.createContext<GameEventBus>(emptyGameContext)
