import { supabase } from "@utils/supabase";
import { logTransaction } from "@api/transactions";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export const fetchProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) console.error(error);
  else return data;
};

export const createProduct = async (newProduct: Product, userId: string) => {
  try {
    const response = await supabase.from("products").insert([
      {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      }]);
    const { status, error } = response;
    if (error) {
      console.error("Error al agregar producto:", error.message);
      throw new Error("No se pudo agregar el producto.");
    }

    // Registrar la transacción del usuario
    await logTransaction(userId, "CREATE_PRODUCT", `Creó el producto: ${newProduct.name}`);

    return response;
  } catch (err) {
    console.error("Error inesperado en createProduct:", err);
    return null;
  }
};


//TODO: Crear funcion para actualizar el producto
