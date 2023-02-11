import * as React from 'react';
import { Badge, Box } from "@mui/material"
import { MJImageFilter } from '../assets';
import { Area } from '../game/context/util';

export const MjImageHeight = {
    center: '55px',
    centerRotate: '45px',
    left: '30px',
    leftRotate: '35px',
    right: '30px',
    rightRotate: '35px',
    top: '55px',
    bottom: '75px'
}

export interface MjExtra {
    text: string,
    color: any,
    tile: number
}

export interface MJMode {
    value: number
    area: Area
    extra?: MjExtra
    height?: string
    lasted?: boolean
    forbid?: boolean
}

export const MjBottomImage: React.FC<{ mj: number, setReadyCall?: any, extra?: MjExtra }> = ({ mj, setReadyCall, extra }) => {
    const [ready, setReady] = React.useState<boolean>(false)
    const readyOutClick = (e: any) => {
        if (!setReadyCall) {
            return
        }
        setReady(!ready)
        //回调
        return setReadyCall!(mj, !ready)
    }

    return (
        <Box onClick={(e) => readyOutClick(e)} className={ready ? 'hasReady' : 'noReady'}>
            <MjImage value={mj} area={Area.Bottom} height={MjImageHeight.bottom} extra={extra} />
        </Box >
    )
}


export const MjImage: React.FC<MJMode> = ({ value, area, height = '45px', lasted = false, extra }) => {

    let rotate = '', dh = '35px'
    if (area === Area.Left) {
        rotate = 'rotate(90deg)'
        dh = MjImageHeight.left
    } else if (area === Area.Top) {
        rotate = 'rotate(180deg)'
        dh = MjImageHeight.top
    } else if (area === Area.Bottom) {
        rotate = 'rotate(0deg)'
        dh = MjImageHeight.bottom
    } else if (area === Area.Right) {
        rotate = 'rotate(270deg)'
        dh = MjImageHeight.right
    } else {
        rotate = 'rotate(0deg)'
    }

    if (height) {
        dh = height
    }

    if (extra) {
        return (
            <Badge badgeContent={extra.text} color={extra.color}>
                <img src={MJImageFilter(value)} alt='' style={{ height: dh, transform: rotate }} />
            </Badge>
        )
    }

    return (<img src={MJImageFilter(value)} alt=''
        style={{
            height: dh,
            transform: rotate,
            filter: value < 0 ? 'opacity(0.2)' : '',
            border: lasted ? '3px solid #da5151' : ''
        }} />)
}
