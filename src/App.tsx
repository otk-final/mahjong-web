import React, { Ref, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import './App.css';
import { Box, Divider, FormControlLabel, IconButton, Paper, Radio, RadioGroup, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { roomProxy } from './api/http';
import { NotifyArea, NotifyBus, NotifyContext } from './component/alert';

function App() {

  const [roomId, setRoomId] = useState<string>('100')
  const navigator = useNavigate()
  const mockRef = useRef(null)

  //跳转
  const submitJoin = function (event: any) {
    if (roomId === '') {
      return
    }
    const mc: any = mockRef.current
    const playId: string = mc.getCheck()
    navigator('/game/' + roomId + "/" + playId)
  }

  const valueChange = function (event: any) {
    setRoomId(event.target.value)
  }


  const appNotify = new NotifyBus()

  return (
    <NotifyContext.Provider value={appNotify}>
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
          <UserPlayer defaultPlayerId={'a'} ref={mockRef} />
        </Stack>
        <UserDial />
        <NotifyArea />
      </Box>
    </NotifyContext.Provider>
  );
}

const UserPlayer = forwardRef((props: { defaultPlayerId: string }, ref: Ref<any>) => {
  const [value, setValue] = React.useState<string>(props.defaultPlayerId);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  useImperativeHandle(ref, () => ({
    getCheck: (): string => {
      return value
    }
  }))

  return (
    <RadioGroup
      value={value}
      row
      onChange={handleChange}
    >
      <FormControlLabel value="a" control={<Radio />} label="玩家A" />
      <FormControlLabel value="b" control={<Radio />} label="玩家B" />
      <FormControlLabel value="c" control={<Radio />} label="玩家C" />
      <FormControlLabel value="d" control={<Radio />} label="玩家D" />
    </RadioGroup>

  );
})


const UserDial: React.FC = () => {
  const notifyCtx = useContext<NotifyBus>(NotifyContext)

  const createRoom = (event: any) => {
    roomProxy('a').create({}).then((resp: any) => {

    }).catch((err: any) => {
      notifyCtx.error(err.message)
    })
  }

  const showHistory = (event: any) => {

  }

  return (
    <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'absolute', bottom: 30, right: 30 }} icon={<SpeedDialIcon />} open={true}>
      <SpeedDialAction key={'create'} icon={<AddIcon />} tooltipTitle={'创建房间'} onClick={(e) => { createRoom(e) }} />
      <SpeedDialAction key={'history'} icon={<HistoryIcon />} tooltipTitle={'历史记录'} onClick={(e) => { showHistory(e) }} />
    </SpeedDial>
  )
}


export default App;
