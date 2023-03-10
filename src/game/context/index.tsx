import React from 'react';
import { EmptyPlayer, Player } from '../../component/player';
import { MjExtra } from '../../component/tile';
import { Area } from './util';
import { NetConnect } from '../../api/websocket';
import { gameBegin, gameQuit, memberExit, memberJoin, putPlay, racePlay, skipPlay, takePlay, turnPlay, winPlay } from './consumer';
import { gameApi } from '../../api/http';
import { LoadingBus } from '../../component/loading';
import { NotifyBus } from '../../component/alert';



// 游戏
export class GameEventBus {

    playerMap: Map<Area, Player> = new Map()
    refMap: Map<Area, PlayerReducer> = new Map()
    reduxMap: Map<Area, PlayerReducer> = new Map()

    //房间信息
    roomId: string
    ployId: string
    mine: Player
    constructor(roomId: string, ployId: string, mine: Player) {
        this.roomId = roomId
        this.ployId = ployId
        this.mine = mine
    }

    getGamePolyId(): string {
        return this.ployId
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
        this.effectRef.current.show(area, race)
    }
    doRemoveEffect() {
        this.effectRef.current.hide()
    }
    doOutput(area: Area, ...tiles: number[]) {
        this.centerRef.current.output(area, ...tiles)
    }
    doOutputAndLasted(area: Area, ...tiles: number[]) {
        this.centerRef.current.output(area, ...tiles)
        this.centerRef.current.outLastedChange(area)
    }
    doOutLastedChange(area: Area) {
        this.centerRef.current.outLastedChange(area)
    }
    doRaceby(area: Area, tile: number) {
        this.centerRef.current.raceby(area, tile)
    }
    doUpdateRemained(num: number) {
        this.remainedRef.current.updateRemained(num)
    }
    doChangeTurn(area: Area) {
        this.turnRef.current.changeTurn(area)
    }
    doCountdownReset(interval: number) {
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
    //开启状态变更
    setBegin(flag: boolean) {
        this.begining = flag
    }
    isBegin() {
        return this.begining
    }


    mjExtras: Array<MjExtra> = []
    doUpdateMjExtras(extras: Array<MjExtra>) {
        this.mjExtras = extras
        this.extraRef.current.updateExtras(extras)
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
        conn.subscribe(102, (payload: any) => { gameBegin(this, payload) })
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
        //结束
        conn.subscribe(109, (payload: any) => { gameQuit(this, payload) })
    }

    //挂机
    doRobot(enable: boolean) {
        this.loadingCtx?.show()
        gameApi.robot({ roomId: this.roomId, open: enable, level: 1 }).then((resp: any) => {
            this.notifyCtx?.success('挂机中')
        }).catch(err => {
            this.notifyCtx?.error(err)
        })
    }
}

export interface TileCollect {
    outs: Array<number>
    hands: Array<number>
    races: Array<Array<number>>
    take: number
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

    tileCollect: TileCollect = { hands: [], races: [], take: -1, outs: [] }
    setTileCollect(init: TileCollect) {
        //分离 hand take 渲染
        if (init.take !== -1) {
            let takeIdx = init.hands.indexOf(init.take)
            if (takeIdx !== -1) {
                init.hands.splice(takeIdx, 1)
            }
        }
        init.hands.sort((a, b) => a - b)
        this.tileCollect = init
        this.getTileCurrent().updateTileCollect(this.tileCollect)
    }

    getTileCollect(): TileCollect {
        return this.tileCollect
    }
    outLasted: boolean = false
    isLastedOuput(): boolean {
        return this.outLasted
    }
    setLastedOuput(ok: boolean) {
        this.outLasted = ok
    }
    //出牌
    doPut(tile: number,hands:Array<number>) {
        this.tileCollect.outs.push(tile)
        
        this.tileCollect.hands = hands
        this.tileCollect.take = -1
        
        this.getTileCurrent().updateTileCollect(this.tileCollect)
    }
    //摸牌
    doTake(tile: number) {
        this.tileCollect.take = tile
        this.getTileCurrent().updateTileCollect(this.tileCollect)
    }
    
    //持牌
    doHands(tiles: Array<number>) {
        tiles.sort((a, b) => a - b)
        this.tileCollect.hands = tiles
        this.getTileCurrent().updateTileCollect(this.tileCollect)
    }
    //判定
    doRace(race: number, tiles: Array<number>, hands: Array<number>) {
        //自杠 覆盖
        if (race === 204) {
            this.replaceEEEEUpgradeRace(tiles)
        } else {
            this.tileCollect.races.push(tiles)
        }
        this.tileCollect.hands = hands
        this.getTileCurrent().updateTileCollect(this.tileCollect)
    }
    replaceEEEEUpgradeRace(tiles: Array<number>) {
        const races = this.tileCollect.races
        for (var i = 0; i < races.length; i++) {
            const item: Array<number> = races[i]
            if (item.length === 3 && item[0] === tiles[0] && item[1] === tiles[1] && item[2] === tiles[2]) {
                races[i] = tiles
            }
        }
    }
}



const emptyGameContext = new GameEventBus('empty', '', EmptyPlayer)
export const GameContext = React.createContext<GameEventBus>(emptyGameContext)
