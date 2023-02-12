import React, { useContext, useState } from 'react';
import './App.css';
import { Box, Divider, Grid, IconButton, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import { roomProxy } from './api/http';
import { NotifyArea } from './component/alert';
import { GamePloy, GamePloyCard } from './component/ploy';


function App() {

  const [roomId, setRoomId] = useState<string>('100')
  const navigator = useNavigate()

  //跳转
  const submitJoin = function (event: any) {
    if (roomId === '') {
      return
    }
    //模拟用户
    navigator('/game/' + roomId + "/a")
  }

  const valueChange = function (event: any) {
    setRoomId(event.target.value)
  }

  const ploys: Array<GamePloy> = [{
    key: 'std',
    name: '基础',
    info: ''
  }, {
    key: 'lai-you',
    name: '一脚癞油',
    info: ''
  }, {
    key: 'lai-huang',
    name: '癞幌',
    info: ''
  }, {
    key: 'lai-gang',
    name: '红中癞子杠',
    info: ''
  }, {
    key: 'lai-unique',
    name: '一癞到底',
    info: ''
  }]

  return (
    <Box sx={{ height: '100vh', bgcolor: 'aliceblue' }} justifyContent={'center'} >
      <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center" spacing={2}>
        <Paper elevation={1} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
          <TextField label="请输入游戏房间号"
            variant="standard"
            color="primary"
            sx={{ width: '400px' }}
            value={roomId}
            onChange={valueChange}
            autoFocus
            focused />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={(e) => submitJoin(e)}>
            <ArrowRightAltIcon />
          </IconButton>
        </Paper>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          {
            Array.from(ploys).map((item: GamePloy, idx) => (
              <Grid item key={idx}>
                <GamePloyCard ploy={item} />
              </Grid>
            ))
          }
        </Grid>
      </Stack>
      <NotifyArea />
    </Box>
  );
}

export default App;
