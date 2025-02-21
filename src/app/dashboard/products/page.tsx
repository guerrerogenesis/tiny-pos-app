"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@utils/authContext";
import ProductModal from "@components/productModal";
import LoadingSpiner from "@components/loadingSpiner";

import { fetchProducts, createProduct } from "@api/products";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading]);

  useEffect(() => {
    fetchProducts().then((data: any) => {
      setProducts(data);
    });
  }, []);

  const getProducts = async () => {
    const data = await fetchProducts();
    if (data) {
      setProducts(data);
    }
  };

  const addProduct = async (newProduct: Product) => {
    if (!user?.id) { //valida si existe user para consultar createproduct
      alert("Error: el usuario no está autenticado.");
      return;
    }
    if (
      !newProduct.name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.stock
    )
      return;

    try {
      const data = await createProduct(newProduct, user.id);
      if (data?.status === 201 || data?.data) {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setShowModal(false);
        setNewProduct({ name: "", description: "", price: "", stock: "" });
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  if (loading || !user) return <LoadingSpiner />;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-end items-end gap-2 ">
        <button
          onClick={getProducts}
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
      <h1 className="text-2xl font-bold">📦 Gestión de Productos</h1>

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addProduct}
      />
      <table className="w-full border-collapse border rounded border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left">
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">Price</th>
            <th className="p-2 border border-gray-300">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="p-2 border border-gray-300">{product.name}</td>
                <td className="p-2 border border-gray-300">${product.price}</td>
                <td className="p-2 border border-gray-300">{product.stock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <span>TODO: añadir funcion editar productos</span>

    </div>
  );
}
