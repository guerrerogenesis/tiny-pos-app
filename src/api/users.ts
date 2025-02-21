import { supabase } from "@utils/supabase";

export const fetchUsers = async () => {
  const { data, error } = await supabase.rpc("get_users");
  console.log("fetchUsers", data, error);
  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return [];
  }

  return data;
};


export const getUserById = async (userId: string) => {
  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    console.error("Error al obtener el usuario:", error.message);
    return null;
  }

  return data.user;
};