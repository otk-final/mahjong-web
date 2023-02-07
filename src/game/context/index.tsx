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

    doEffect(area: Area, race: number) {
        //延迟
        this.effectRef.current.append(area, race)
    }
    doRemoveEffect() {
        this.effectRef.current.remove()
    }
    doOutput(area: Area, ...tiles: number[]) {
        this.centerRef.current.output(area, ...tiles)
    }
    doRaceby(area: Area, tile: number) {
        this.centerRef.current.raceby(area, tile)
    }

    doUpdateRemained(num: number) {
        this.remainedRef.current.updateRemained(num)
    }
    doChangeTurn(area:Area){
        this.turnRef.current.changeTurn(area)
    }
    doCountdownReset(interval:number){
        this.countdwonRef.current.start(interval)
    }
    loadingCtx?: LoadingBus
    notifyCtx?: NotifyBus
    bindLoadingCtx(ctx: LoadingBus) {
        this.loadingCtx = ctx
    }
    bindNotifyCtx(ctx: NotifyBus) {
        this.notifyCtx = ctx
    }


    begining: boolean = false
    //开始游戏
    startGame() {
        gameProxy(this.mine.uid).start({ roomId: this.roomId }).then((resp) => {
            console.info(resp)
            this.begining = true
        }).catch((err) => {

        })
    }
    //退出游戏
    exitGame() {
        debugger
    }
    //开启状态变更
    setBegin(flag:boolean) {
        this.begining = flag
    }
    isBegin(){
        return this.begining
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
    areaRef: any
    constructor(area: Area, player: Player, areaRef: any) {
        this.area = area
        this.player = player
        this.areaRef = areaRef
    }

    getAreaCurrent(): any {
        return this.areaRef.current
    }

    tileRef: any
    raceRef: any
    getTileCurrent(): any {
        return this.tileRef.current
    }
    bindTileRef(ref: any) {
        this.tileRef = ref
    }
    bindRaceRef(ref: any) {
        this.raceRef = ref
    }
    getRaceCurrent(): any {
        return this.raceRef.current
    }

    //持有数据
    hands: Array<number> = new Array<number>()
    take: number = -1
    races: Array<Array<number>> = new Array<Array<number>>()

    display: boolean = false
    outs: Array<number> = new Array<number>()
    outLasted: boolean = false

    setTake(tile: number) {
        this.take = tile
    }
    setOuts(tiles: Array<number>){
        this.outs = tiles
    }
    setHand(tiles: Array<number>) {
        this.hands = tiles
        this.getTileCurrent().updateHands(tiles)
    }
    setRaces(tiles: Array<Array<number>>){
        this.races = tiles
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
    //出牌
    doPut(tile: number) {
        this.outs.push(tile)
    }
    //摸牌
    doTake(tile: number) {
        this.take = tile
        this.getTileCurrent().updateTake(tile)
    }
    //判定
    doRace(tiles: Array<number>) {
        this.races.push(tiles)
        this.getTileCurrent().appendRace(tiles)
    }
}



const emptyGameContext = new GameEventBus('empty', 0, EmptyPlayer)
export const GameContext = React.createContext<GameEventBus>(emptyGameContext)
