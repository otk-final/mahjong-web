import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GameMainRoute } from './game/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { LoadingBus, LoadingContext } from './component/loading';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const loadingBus = new LoadingBus()

root.render(
  <LoadingContext.Provider value={loadingBus}>
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<App />} />
        <Route path='/game/:roomId/:playerId' element={<GameMainRoute />} />
      </Routes>
    </BrowserRouter>
  </LoadingContext.Provider>
);