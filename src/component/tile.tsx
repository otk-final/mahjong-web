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
    tile: number
}

export const MjBottomImage: React.FC<{ mj: number, callPut?: any, extra?: MjExtra }> = ({ mj, callPut, extra }) => {
    // debugger
    const [ready, setReady] = React.useState<boolean>(false)
    const readyOutClick = (e: any) => {
        if (!callPut) {
            return
        }
        setReady(!ready)
        //回调
        return callPut!(mj, !ready)
    }

    return (
        <Box onClick={(e) => readyOutClick(e)} className={ready ? 'hasReady' : 'noReady'}>
            <MjImage mj={mj} direction={'bottom'} height='75px' extra={extra} />
        </Box >
    )
}





export const MjImage: React.FC<{ mj: number, direction: Area | string, height?: string, lasted?: boolean, extra?: MjExtra }> = ({ mj, direction, height = '45px', lasted = false, extra }) => {

    let rotate = '', defaultHeight = '35px'
    if (direction === 'left') {
        rotate = 'rotate(90deg)'
        defaultHeight = MjImageHeight.left
    } else if (direction === 'top') {
        rotate = 'rotate(180deg)'
        defaultHeight = MjImageHeight.top
    } else if (direction === 'bottom') {
        rotate = 'rotate(0deg)'
        defaultHeight = MjImageHeight.bottom
    } else if (direction === 'right') {
        rotate = 'rotate(270deg)'
        defaultHeight = MjImageHeight.right
    } else {
        rotate = 'rotate(0deg)'
    }

    if (height) {
        defaultHeight = height
    }

    if (extra) {
        return (
            <Badge badgeContent={extra.text} color={extra.text === '癞' ? 'error' : (extra.text === '鬼' ? 'warning' : 'primary')}>
                <img src={MJImageFilter(mj)} alt='' style={{ height: defaultHeight, transform: rotate }} />
            </Badge>
        )
    }

    return (<img src={MJImageFilter(mj)} alt='' style={{ height: defaultHeight, transform: rotate, border: lasted ? '3px solid #da5151' : '' }} />)
}