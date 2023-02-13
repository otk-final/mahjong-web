import * as React from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { GamePloyFilter } from '../assets';
import { roomApi } from '../api/http';
import { NotifyBus, NotifyContext } from './alert';
import { useNavigate } from 'react-router-dom';


export interface GamePloy {
    key: string,
    name: string,
    info: string
}

export const GamePloyCard: React.FC<{ ploy: GamePloy }> = ({ ploy }) => {

    const notifyCtx = React.useContext<NotifyBus>(NotifyContext)
    const navigator = useNavigate()

    const gamePloyKey = ploy.key

    const createRoom = (event: any) => {
        var param = {
            mode: gamePloyKey, nums: 4, custom: {}
        }

        //创建房间
        roomApi.create(param).then((resp: any) => {
            notifyCtx.success('创建成功')
            navigator('/game/' + resp.data.roomId)
        }).catch((err: any) => {
            notifyCtx.error(err)
        })
    }


    const startComputeBattle = (event: any) => {
        var param = {
            mode: gamePloyKey, nums: 4, custom: {}
        }
        //创建房间
        roomApi.compute(param).then((resp: any) => {
            notifyCtx.success('创建成功')
            navigator('/game/' + resp.data.roomId)
        }).catch((err: any) => {
            notifyCtx.error(err)
        })
    }


    return (
        <Card sx={{ minWidth: 500 }}>
            <CardMedia
                sx={{ height: 120, width: 500 }}
                image={GamePloyFilter(ploy.key)}
                title={ploy.name}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {ploy.info}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={(e) => { createRoom(e) }}>创建房间</Button>
                <Button size="small" onClick={(e) => { startComputeBattle(e) }}>人机对战</Button>
            </CardActions>
        </Card>
    );
}