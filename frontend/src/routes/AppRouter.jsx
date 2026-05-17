import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { WorkspacePage } from '../pages/workspace/WorkspacePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/room/:roomCode',
        element: <WorkspacePage />
      }
    ]
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
