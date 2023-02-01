import React, { useState } from 'react';
import './App.css';
import { Box, Container, Divider, FormControl, FormControlLabel, FormLabel, IconButton, Paper, Radio, RadioGroup, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function App() {

  const [roomId, setRoomId] = useState<string>('100')
  const navigator = useNavigate()

  //跳转
  const submitJoin = function (event: any) {
    if (roomId === '') {
      return
    }
    navigator('/game/' + roomId)
  }

  const valueChange = function (event: any) {
    setRoomId(event.target.value)
  }

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
        <UserPlayer />
      </Stack>
      <UserDial />
    </Box>
  );
}

const UserPlayer: React.FC = () => {
  const [value, setValue] = React.useState('a');

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <RadioGroup
      // aria-labelledby="demo-controlled-radio-buttons-group"
      // name="controlled-radio-buttons-group"
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
}

const UserDial: React.FC = () => {
  return (
    <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'absolute', bottom: 30, right: 30 }} icon={<SpeedDialIcon />} open={true}>
      <SpeedDialAction key={'create'} icon={<AddIcon />} tooltipTitle={'创建房间'} />
      <SpeedDialAction key={'history'} icon={<HistoryIcon />} tooltipTitle={'历史记录'} />
    </SpeedDial>
  )
}



export default App;
