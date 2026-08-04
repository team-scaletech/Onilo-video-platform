import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

const DashboardPage = lazy(() =>
  import('../../modules/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const PlayerShowcasePage = lazy(() =>
  import('../../modules/player/pages/PlayerShowcasePage').then((m) => ({ default: m.PlayerShowcasePage }))
);
const AdminDashboardPage = lazy(() =>
  import('../../modules/admin/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const ProfilePage = lazy(() =>
  import('../../modules/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const LoginPage = lazy(() =>
  import('../../modules/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner size="lg" label="Loading Login Portal..." />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" label="Loading Dashboard Showcase..." />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'player/:id',
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" label="Initializing Interactive Vidstack Player..." />}>
            <PlayerShowcasePage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" label="Loading User Profile Details..." />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" label="Loading Enterprise Admin Portal..." />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" label="Loading Analytics Telemetry..." />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" label="Loading..." />}>
            <DashboardPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};
