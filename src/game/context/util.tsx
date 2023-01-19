/* eslint-disable import/no-anonymous-default-export */
import React, { useReducer } from "react";

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


