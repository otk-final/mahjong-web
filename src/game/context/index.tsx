import { Player } from '../../component/player';



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

    injectTurnChange: any
    onTurnChange(fn: any) {
        this.injectTurnChange = fn
    }

    injectRemainedChange: any
    onRemainedChange(fn: any) {
        this.injectRemainedChange = fn
    }

    injectRaceEffect: any
    onRaceEffect(fn: any) {
        this.injectRaceEffect = fn
    }

    injectOutput: any
    onOutput(fn: any) {
        this.injectOutput = fn
    }

    //开始游戏
    start() {

    }

    //游戏结束
    finish() {

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
            return [0,0,0,0,0]
        }
        return [2, 3, 4]
    }
    getTake(): number {
        return 23
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
        return [1,2,3,12,3]
    }
}






export function NewPlayerContext() {

}