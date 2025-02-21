'use client';
import Navbar from '@components/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex p-3 max-w-5xl m-auto">{children}</main>
    </>
  );
}