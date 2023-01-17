import * as React from 'react';
import { Badge, Box } from "@mui/material"
import { MJImageFilter } from '../assets';

export const MjImageHeight = {
    center: '55px',
    centerRotate: '45px',
    left: '40px',
    leftRotate: '35px',
    right: '40px',
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
    const [readyOutLayout, setReadyOutLayout] = React.useState<{ pos: string, top: string }>({ pos: 'unset', top: '0px' })
    const readyOutClick = (e: any) => {
        if (!callPut) {
            return
        }
        if (readyOutLayout.pos === 'unset') {
            setReadyOutLayout({ pos: 'relative', top: '-20px' })
        } else {
            setReadyOutLayout({ pos: 'unset', top: '0px' })
        }
        //回调
        callPut!(mj, readyOutLayout.pos === 'unset')
    }

    return (
        <Box onClick={(e) => readyOutClick(e)} sx={{ position: readyOutLayout.pos, top: readyOutLayout.top }}>
            <MjImage mj={mj} direction={'bottom'} height='75px' extra={extra} />
        </Box >
    )
}


export const MjImage: React.FC<{ mj: number, direction: string, height?: string, lasted?: false, extra?: MjExtra }> = ({ mj, direction, height = '45px', lasted = false, extra }) => {

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
    return (<img src={MJImageFilter(mj)} alt='' style={{ height: defaultHeight, transform: rotate }} />)
}