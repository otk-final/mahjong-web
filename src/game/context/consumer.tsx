import { GameEventBus } from ".";

//加入房间
export const memberJoin = (bus: GameEventBus, payload: any) => {
    console.info("memberJoin", payload)
}

//退出房间
export const memberExit = (bus: GameEventBus, payload: any) => {

}

//游戏开始
export const startGame = (bus: GameEventBus, payload: any) => {

}

export const takePlay = (bus: GameEventBus, payload: any) => {

}

export const putPlay = (bus: GameEventBus, payload: any) => {

}

export const racePlay = (bus: GameEventBus, payload: any) => {

}

export const winPlay = (bus: GameEventBus, payload: any) => {

}

export const skipPlay = (bus: GameEventBus, payload: any) => {

}

export const turnPlay = (bus: GameEventBus, payload: any) => {

}