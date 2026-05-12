import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {children ?? <Outlet />}
    </div>
  );
}