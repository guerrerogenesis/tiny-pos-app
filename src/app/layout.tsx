"use client";
import "@styles/globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@utils/authContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <html lang="es">
        <body>
          {children} {/* Aquí se renderizarán las páginas */}
        </body>
      </html>
    </AuthProvider>
  );
}
