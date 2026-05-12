import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/Home';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { NotFoundPage } from '@/pages/NotFound';
import { SupabaseDiagnostic } from '@/components/common/SupabaseDiagnostic';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'diagnostico', element: <SupabaseDiagnostic /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);