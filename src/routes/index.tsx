import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/Home';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { DashboardPage } from '@/pages/Dashboard';
import { NotFoundPage } from '@/pages/NotFound';
import { SupabaseDiagnostic } from '@/components/common/SupabaseDiagnostic';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteErrorBoundary } from './RouteErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
      { path: 'register', element: <RegisterPage />, errorElement: <RouteErrorBoundary /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      { path: 'diagnostico', element: <SupabaseDiagnostic /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
