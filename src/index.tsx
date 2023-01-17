import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import { GameMainArea } from './game/index';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GameMainArea roomId={'123'} round={0} />
);