
//万字
import w1 from "./mj/一万.png"
import w2 from "./mj/二万.png"
import w3 from "./mj/三万.png"
import w4 from "./mj/四万.png"
import w5 from "./mj/五万.png"
import w6 from "./mj/六万.png"
import w7 from "./mj/七万.png"
import w8 from "./mj/八万.png"
import w9 from "./mj/九万.png"
//条字
import t1 from "./mj/一条.png"
import t2 from "./mj/二条.png"
import t3 from "./mj/三条.png"
import t4 from "./mj/四条.png"
import t5 from "./mj/五条.png"
import t6 from "./mj/六条.png"
import t7 from "./mj/七条.png"
import t8 from "./mj/八条.png"
import t9 from "./mj/九条.png"
//筒字
import b1 from "./mj/一饼.png"
import b2 from "./mj/二饼.png"
import b3 from "./mj/三饼.png"
import b4 from "./mj/四饼.png"
import b5 from "./mj/五饼.png"
import b6 from "./mj/六饼.png"
import b7 from "./mj/七饼.png"
import b8 from "./mj/八饼.png"
import b9 from "./mj/九饼.png"
//风
import east from "./mj/东风.png"
import south from "./mj/南风.png"
import west from "./mj/西风.png"
import north from "./mj/北风.png"
//字
import zh from "./mj/红中.png"
import fa from "./mj/发财.png"
import ba from "./mj/白板.png"
import defaultImg from "./mj/背景.png"


import raceDDD from './effect/碰.png'
import raceEEEE from './effect/杠.png'
import raceEEEEUpgrade from './effect/杠.png'
import raceEEEEOwn from './effect/杠.png'

import raceABC from './effect/吃.png'
import raceWin from './effect/胡.png'

import racePass from './effect/过.png'
import racePut from './effect/出.png'
import raceTake from './effect/摸.png'

import raceLai from './effect/癞.png'
import raceCao from './effect/朝.png'
import raceGui from './effect/鬼.png'


import av1 from './avatar/a1.png'
import av2 from './avatar/a2.png'
import av3 from './avatar/a3.png'
import av4 from './avatar/a4.png'
import av5 from './avatar/a5.png'


import stdPloy from './ploy/基础麻将.png'
import laiYou from './ploy/一脚癞油.png'
import laiUnique from './ploy/一癞到底.png'
import laiGang from './ploy/红中癞子杠.png'
import laiHuang from './ploy/癞幌.png'

export const MJRaces = {
    200: raceWin,
    201: raceDDD,
    202: raceABC,

    203: raceEEEE,
    204: raceEEEEUpgrade,
    205: raceEEEEOwn,

    206: raceLai,
    207: raceCao,
    208: raceGui,

    0: racePass,
    1: racePut,
    2: raceTake
}

export const MJExtarColors = {
    "鬼": "error",
    "癞": "primary",
    "朝": "warning"
}


export const MJImages = {
    //万字
    1: w1,
    2: w2,
    3: w3,
    4: w4,
    5: w5,
    6: w6,
    7: w7,
    8: w8,
    9: w9,
    //条字
    11: t1,
    12: t2,
    13: t3,
    14: t4,
    15: t5,
    16: t6,
    17: t7,
    18: t8,
    19: t9,
    //筒字
    21: b1,
    22: b2,
    23: b3,
    24: b4,
    25: b5,
    26: b6,
    27: b7,
    28: b8,
    29: b9,
    //风
    31: east,
    33: south,
    35: west,
    37: north,
    //字
    41: zh,
    43: fa,
    45: ba,
    0: defaultImg,
}



export function MJImageFilter(key) {
    return MJImages[Math.abs(key)]
}


export function MJRaceFilter(key) {
    return MJRaces[key]
}

export function MJExtarColorFilter(key) {
    return MJExtarColors[key]
}


export const AvatarImages = {
    0: av1,
    1: av2,
    2: av3,
    3: av4,
    4: av5,
}

export function AvatarRandom() {
    return AvatarImages[Math.round(Math.random() * 4)]
}


const gamePloy = {
    'std': stdPloy,
    'lai-huang': laiHuang,
    'lai-you': laiYou,
    'lai-unique': laiUnique,
    'lai-gang': laiGang,
}

export function GamePloyFilter(key) {
    return gamePloy[key]
}