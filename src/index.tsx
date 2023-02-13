import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GameMainRoute } from './game/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { LoadingBus, LoadingContext } from './component/loading';
import { NotifyBus, NotifyContext } from './component/alert';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <LoadingContext.Provider value={new LoadingBus()}>
    <NotifyContext.Provider value={new NotifyBus()}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<App />} />
          <Route path='/game/:roomId' element={<GameMainRoute />} />
        </Routes>
      </BrowserRouter>
    </NotifyContext.Provider>
  </LoadingContext.Provider>
);