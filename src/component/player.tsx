import * as React from 'react';
import { Avatar, Stack, Typography } from "@mui/material"
import { AvatarRandom } from "../assets"

export interface Player {
    pIdx: number
    name: string
    ip: string
    avatar: string
    status: "user" | "robot"
}


export const AvatarArea: React.FC<{ user: Player }> = ({ user }) => {
    console.info('AvatarArea', user)
    return (
        <Stack direction={'row'} spacing={1}>
            <Avatar variant="rounded" src={AvatarRandom()} sx={{ width: 50, height: 50 }} />
            <Stack justifyContent={'center'}>
                <Typography variant='caption'>{user.name}</Typography>
                <Typography variant='caption'>{user.ip}</Typography>
            </Stack>
        </Stack>
    )
}




