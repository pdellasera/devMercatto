import React from 'react';
import { RouteObject } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import DashboardMobile from './pages/DashboardMobile';
import LoginMobile from './pages/LoginMobile';
import ProspectsMobile from './pages/ProspectsMobile';
import ProspectDetailMobile from './pages/ProspectDetailMobile';

export const mobileRoutes: RouteObject = {
  path: '/mobile',
  element: <MobileLayout />,
  children: [
    { index: true, element: <DashboardMobile /> },
    { path: 'login', element: <LoginMobile /> },
    { path: 'prospects', element: <ProspectsMobile /> },
    { path: 'prospects/:id', element: <ProspectDetailMobile /> },
  ],
};

export default mobileRoutes;


