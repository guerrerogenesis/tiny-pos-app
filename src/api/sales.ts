import { supabase } from "@utils/supabase";
import { logTransaction } from "@api/transactions";

interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
}
export const fetchSales = async () => {
  const { data, error } = await supabase.from("sales").select("*");
  if (error) console.error(error);
  else return data;
};

export const createSale = async (userId: string, saleItems: SaleItem[]) => {
  try {
    const totalAmount = saleItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // valida stock por cada uno de los productos
    for (const item of saleItems) {
      const isStockAvailable = await checkStock(item.productId, item.quantity);
      if (!isStockAvailable) {
        return {
          status: 400,
          message: `Stock insuficiente para el producto: ${item.productId} `,
        };
      }
    }

    // inserta la venta general
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert([{ user_id: userId, total_amount: totalAmount }])
      .select()
      .single();

    if (saleError) {
      return {
        status: 500,
        message: `Error al crear la venta: ${saleError.message}`,
      }; 
    }

    await logTransaction(userId, "CREATE_SALE", { saleId: sale.id });

    return {
      status: 200,
      saleId: sale.id,
      message: "Venta creada exitosamente.",
    }; 
  } catch (error: any) {
    console.error("Error en createSale:", error.message);
    return {
      status: 500,
      message: `Error inesperado en createSale: ${error.message}`,
    }; 
  }
};

export const createSaleItem = async (saleId: number, saleItems: SaleItem[]) => {
  try {
    let saleItemsData: any[] = [];

    for (const item of saleItems) {

      // Insertar el item de la venta
      const { data, error } = await supabase
        .from("sale_items")
        .insert([
          {
            sale_id: saleId,
            product_id: Number(item.productId),
            quantity: item.quantity,
            price: item.price,
          },
        ])
        .select();

      if (error) {
        return {
          status: 500,
          message: `Error al crear los items de la venta: ${error.message}`,
        }; // Error de base de datos
      }

      saleItemsData.push(...data);
    }

    return {
      status: 200,
      data: saleItemsData,
      message: "Items de la venta creados exitosamente.",
    }; 
  } catch (error: any) {
    console.error("Error en createSaleItem:", error.message);
    return {
      status: 500,
      message: `Error inesperado en createSaleItem: ${error.message}`,
    }; 
  }
};

const checkStock = async (productId: number, quantity: number) => {
  const { data, error } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error al obtener el stock:", error.message);
    throw new Error("No se pudo verificar el stock.");
  }

  return data.stock >= quantity;
};
