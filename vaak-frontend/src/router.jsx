import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Dictionary from './pages/Dictionary';
import Translate from './pages/Translate';
import History from './pages/History';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/dictionary',
        element: <Dictionary />,
      },
      {
        path: '/translate',
        element: <Translate />,
      },
      {
        path: '/history',
        element: <History />,
      },
    ],
  },
]);

export default router;
