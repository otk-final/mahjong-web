import { Player } from '../../component/player';
import { MjExtra } from '../../component/tile';



export enum Area {
    Left = 'left',
    Right = 'right',
    Bottom = 'bottom',
    Top = 'top',
    Nil = 'nil'
}


// 查找方位
export function FindArea(minePosIdx: number, targetPosIdx: number): Area {
    if (minePosIdx === targetPosIdx) {
        return Area.Bottom
    }
    if (Math.abs(minePosIdx - targetPosIdx) === 2) {
        return Area.Top
    }

    //起
    if (minePosIdx === 0) {
        return targetPosIdx === minePosIdx + 1 ? Area.Right : Area.Left
    } else {
        return targetPosIdx === minePosIdx - 1 ? Area.Left : Area.Right
    }
}


// 房间
export class RoomContext {
    roomId: string
    round: number

    constructor(roomId: string, round: number) {
        this.roomId = roomId
        this.round = round
    }
}


// 游戏
export class GameContext {

    // 玩家
    Lefter?: PlayerContext
    Righter?: PlayerContext;
    Toper?: PlayerContext;
    Bottomer?: PlayerContext;

    roomCtx: RoomContext
    constructor(roomCtx: RoomContext) {
        this.roomCtx = roomCtx
    }

    join(area: Area, member: Player) {
        const memberCtx = new PlayerContext(area, member, this.roomCtx, this)
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
export class PlayerContext {

    area: Area
    info: Player
    roomCtx: RoomContext
    gameCtx: GameContext

    constructor(area: Area, info: Player, roomCtx: RoomContext, gameCtx: GameContext) {
        this.area = area
        this.info = info
        this.roomCtx = roomCtx
        this.gameCtx = gameCtx
    }


    doPut(action: string, tiles: Array<number>) {
        this.injectPut(tiles)
    }

    removeLastedOutput(tile: number) {

    }

    injectHand: any
    onHand(fn: any) {
        this.injectHand = fn
    }
    injectTake: any
    onTake(fn: any) {
        this.injectTake = fn
    }
    injectPut: any
    onPut(fn: any) {
        this.injectPut = fn
    }
    injectPutRemove: any
    onPutRemove(fn: any) {
        this.injectPutRemove = fn
    }
    injectRace: any
    onRace(fn: any) {
        this.injectRace = fn
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






export function NewPlayerContext() {

}