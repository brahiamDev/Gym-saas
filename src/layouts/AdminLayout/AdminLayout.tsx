import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}