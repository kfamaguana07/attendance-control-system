'use client';

import { Sidebar } from '@/src/presentation/components/layout/Sidebar';
import { Toaster as SonnerToaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 fixed left-0 top-0 h-screen" />
      <main className="flex-1 ml-64 p-8 bg-white">
        {children}
      </main>
      <SonnerToaster position="top-right" richColors />
    </div>
  );
}
