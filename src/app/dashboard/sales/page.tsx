"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@utils/authContext";
import { createSale, createSaleItem } from "@api/sales";

import SaleModal from "@components/saleModal";
import LoadingSpiner from "@components/loadingSpiner";

import { fetchProducts } from "@api/products";
import { fetchUsers } from "@api/users";
import { fetchSales } from "@api/sales";
import { get } from "http";

interface Sale {
  id: number;
  user_id: number;
  total_amount: number;
  created_at: string;
}
interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}
interface createError {
  status: number;
  saleId?: number;
  message: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [createError, setCreateError] = useState<createError>({status:200, message:""});

  const [loadingNewSale, setloadingNewSale] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading]);

  useEffect(() => {
    fetchUsers().then((data: any) => {
      console.log("users", data);
      setUsers(data);
    });
    fetchSales().then((data: any) => {
      setSales(data);
    });
    fetchProducts().then((data: any) => {
      setProducts(data);
    });
  }, []);

  const getSales = async () => {
    const data = await fetchSales();
    if (data) {
      setSales(data);
    }
  };

  const addSale = async (newSale: SaleItem[]) => {
    if (newSale.length === 0) return alert("Selecciona al menos un producto");
    setloadingNewSale(true);
    setShowModal(true);

    try {
      if (!user) return alert("Inicia sesión");
      const response = await createSale(user.id, newSale);
      
      if (response.status === 200) {
        await createSaleItem(response.saleId, newSale);
        console.log("Venta creada con éxito");
        setShowModal(false);
        setloadingNewSale(false);
        fetchSales();
      }else{
        setloadingNewSale(false);
        setCreateError(response);
        
      }
    } catch (error) {
      console.error("Error al crear la venta:", error);
    }
  };

  if (loading || !user) return <LoadingSpiner />;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-end items-end gap-2 ">
        <button
          onClick={getSales}
          className="bg-primary-100 text-white text-xs p-1.5 rounded max-w-max"
        >
          🔄 Refrescar
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-100 text-white text-xs p-1.5 rounded max-w-max"
        >
          ➕ Agregar
        </button>
      </div>
      <h1 className="text-2xl font-bold">💰 Registro de Ventas</h1>
      <SaleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addSale}
        products={products}
        loadingSale={loadingNewSale}
        createError={createError}
      />
      <table className="w-full border-collapse border rounded border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left">
            <th className="p-2 border border-gray-300">ID</th>
            <th className="p-2 border border-gray-300">Vendedor</th>
            <th className="p-2 border border-gray-300">Total</th>
          </tr>
        </thead>
        <tbody>
          {sales && sales.length > 0 ? (
            sales.map((sale) => {
              const seller = users.find((u) => u.id === sale.user_id);
              const username = seller?.email?.split("@")[0] || "Cargando...";
              return (
                <tr key={sale.id} className="border border-gray-300">
                  <td className="p-2 border border-gray-300">{sale.id}</td>
                  <td className="p-2 border border-gray-300">{username}</td>
                  <td className="p-2 border border-gray-300">
                    ${sale.total_amount}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                No hay ventas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
