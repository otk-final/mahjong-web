import * as React from 'react';
import { Avatar, Stack, Typography } from "@mui/material"
import { AvatarRandom } from "../assets"

export interface Player {
    idx: number
    uid: string
    uname: string
    ip: string
    avatar: string
    alias: string
}


export const EmptyPlayer: Player = {
    idx: -1,
    uid: "",
    uname: "",
    ip: "",
    avatar: "",
    alias: "",
}





export const AvatarArea: React.FC<{ user: Player }> = ({ user }) => {
    return (
        <Stack direction={'row'} spacing={1}>
            <Avatar variant="rounded" src={AvatarRandom()} sx={{ width: 50, height: 50 }} />
            <Stack justifyContent={'center'}>
                <Typography variant='caption'>{user.alias}</Typography>
            </Stack>
        </Stack>
    )
}




