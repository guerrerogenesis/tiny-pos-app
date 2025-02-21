import { useEffect, useState } from "react";
import { supabase } from "@utils/supabase";

interface userAuth {
  
    user: {
      email: string;
      id: string;
      last_sign_in_at: string;
      aud: string;
    };
    
  };


export function useAuth() {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data?.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
}
