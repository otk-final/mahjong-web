import * as React from 'react';
import { Badge, Box } from "@mui/material"
import { MJExtarColorFilter, MJImageFilter } from '../assets';
import { Area } from '../game/context/util';

export const MjImageHeight = {
    center: '45px',
    centerRotate: '45px',
    left: '20px',
    leftRotate: '25px',
    right: '20px',
    rightRotate: '25px',
    top: '45px',
    bottom: '50px'
}

export interface MjExtra {
    name: string,
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

export const MjBottomImage: React.FC<{ mj: number, readyClick?: any, extra?: MjExtra }> = ({ mj, readyClick, extra }) => {
    const [stateReady, setReady] = React.useState<boolean>(false)
    const readyOutClick = (e: any) => {
        if (!readyClick) {
            return
        }
        const hasReady = !stateReady
        setReady(hasReady)
        return readyClick(mj, hasReady)
    }

    return (
        <Box onClick={(e) => readyOutClick(e)} className={stateReady ? 'hasReady' : 'noReady'}>
            <MjImage value={mj} area={Area.Bottom} height={MjImageHeight.bottom} extra={extra} />
        </Box >
    )
}


export const MjImage: React.FC<MJMode> = ({ value, area, height = '35px', lasted = false, extra }) => {

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
        const badgeColor: any = MJExtarColorFilter(extra.name)

        return (
            <Badge badgeContent={extra.name} color={badgeColor} sx={{ fontSize: '20' }}>
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
