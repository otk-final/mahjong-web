import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GameMainRoute } from './game/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='*' element={<App />} />
      <Route path='/game/:roomId/:playerId' element={<GameMainRoute />} />
    </Routes>
  </BrowserRouter>
);