import { supabase } from "@utils/supabase";

export async function logTransaction(
  userId: string,
  event_type: string,
  description: any = null
) {
  try {
    const { error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        event_type,
        description: description ? JSON.stringify(description) : null,
      },
    ]);

    if (error) {
      console.error("Error registrando transacción:", error.message);
      throw new Error("No se pudo registrar la transacción.");
    }
  } catch (err) {
    console.error("Error inesperado en logTransaction:", err);
  }
}

export async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Error al obtener transacciones:", error.message);
        throw new Error("No se pudieron obtener las transacciones.");
      }
  
      return data;
    } catch (err) {
      console.error("Error inesperado en getTransactions:", err);
      return null;
    }
  }
