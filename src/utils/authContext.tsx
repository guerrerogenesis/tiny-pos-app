import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@utils/supabase";
import { useRouter } from "next/navigation";
import { logTransaction } from "@api/transactions";

// Definir la estructura del usuario
interface User {
  id: string;
  email: string;
}

// Definir la estructura del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (userId:string) => Promise<void>;
}

// Crear el contexto con un valor inicial vacío
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if ((data.user)){
         setUser({ id: data.user.id, email: data.user.email ?? "" }); // Actualiza el estado del usuario
         await logTransaction(data.user.id, "LOGIN", "inicio de sesion"); // Registra la transacción

         router.push("/dashboard"); // ✅ Redirige al dashboard
    }
  };

  // Función para cerrar sesión
  const logout = async (userId:string) => {
    await supabase.auth.signOut();
    await logTransaction(userId, "LOGOUT", "cierra la sesion"); // Registra la transacción

    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
