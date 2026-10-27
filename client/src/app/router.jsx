import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Home from '../pages/Home';
import CreateMystery from '../pages/CreateMystery';
import Investigation from '../pages/Investigation';
import EvidenceDetail from '../pages/EvidenceDetail';
import Accusation from '../pages/Accusation';
import Result from '../pages/Result';
import History from '../pages/History';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'create', element: <CreateMystery /> },
      { path: 'investigation/:caseId', element: <Investigation /> },
      { path: 'investigation/:caseId/evidence/:evidenceId', element: <EvidenceDetail /> },
      { path: 'investigation/:caseId/accuse', element: <Accusation /> },
      { path: 'investigation/:caseId/result', element: <Result /> },
      { path: 'history', element: <History /> },
      { path: 'dashboard', element: <Navigate to="/history" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
