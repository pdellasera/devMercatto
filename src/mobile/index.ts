import React from 'react';
import { RouteObject } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import DashboardMobile from './pages/DashboardMobile';
import LoginMobile from './pages/LoginMobile';

export const mobileRoutes: RouteObject = {
  path: '/mobile',
  element: <MobileLayout />,
  children: [
    { index: true, element: <DashboardMobile /> },
    { path: 'login', element: <LoginMobile /> },
  ],
};

export default mobileRoutes;


