import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Box, Divider, Grid, IconButton, Paper, Stack, TextField } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import { getVisitor, roomApi, storeVisitor } from './api/http';
import { NotifyArea, NotifyBus, NotifyContext } from './component/alert';
import { GamePloy, GamePloyCard } from './component/ploy';


function App() {

  const [stateRoomId, setRoomId] = useState<string>('')
  const [stateVisitor, setVisitor] = useState<any>(getVisitor())
  const navigator = useNavigate()

  //loading
  const notifyCtx = useContext<NotifyBus>(NotifyContext)

  const roomIdChange = function (event: any) {
    setRoomId(event.target.value)
  }

  //获取游客信息
  useEffect(() => {
    roomApi.visitor({}).then((resp: any) => {
      storeVisitor(resp.data)
      setVisitor(resp.data)
    }).catch(err => {
      notifyCtx.error(err)
    })
  }, [])


  //跳转
  const joinRoom = function (event: any) {
    if (stateRoomId === '') {
      return notifyCtx.error('请输入正确房间号')
    }

    //存在
    if (stateVisitor) {
      return navigator('/game/' + stateRoomId)
    }
  }

  const ploys: Array<GamePloy> = [{
    key: 'std',
    name: '基础',
    info: '标准胡牌，不能胡七对'
  }, {
    key: 'lai-not',
    name: '一脚癞油',
    info: '有红中，不能吃，不能点炮，自摸时不能有癞子'
  }, {
    key: 'lai-multiple',
    name: '癞幌',
    info: '无红中，能吃，能点炮，多个癞子可以胡'
  }, {
    key: 'lai-unique',
    name: '一癞到底',
    info: '无红中，不能吃，能点炮，胡牌时最多只能有一个癞子'
  }]

  return (
    <div>
      <Box sx={{ height: '100vh', bgcolor: 'aliceblue' }} justifyContent={'center'} className='App'>
        <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center" spacing={2}>
          <Paper elevation={1} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
            <TextField label="请输入游戏房间号"
              variant="standard"
              color="primary"
              sx={{ width: '700px' }}
              value={stateRoomId}
              onChange={roomIdChange}
              autoFocus
              focused />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={(e) => joinRoom(e)}>
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
    </div>
  );
}

export default App;
