"use client";
import logo from "@public/images/logo.png";
import { useState, useEffect } from "react";
import { useAuth } from "@utils/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // 🚀 Para redirección
  const { login } = useAuth();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (error : any) {
      console.error("Error al iniciar sesión", error);
      setError(error.message);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center h-screen mx-auto px-3 ">
      <div className="flex flex-col items-center justify-center gap-5 bg-white-1 p-6  rounded shadow-md w-full max-w-sm">
        <Image src={logo} alt="Logo" width={50} height={50} />
        <h2>Bienvenido</h2>
        <p>Inicia sesión para continuar</p>
        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500">{error}</p>}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-secondary-100 text-slate-900 p-2 rounded"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
