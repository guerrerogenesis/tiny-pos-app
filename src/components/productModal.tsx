"use client";

import { useState } from "react";


interface Product {
  id?:number;
  name: string;
  description: string;
  price: number;
  stock: number;
};
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProduct: Product) => Promise<void>; // <-- Asegurar que onSave recibe saleItems
};

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
}: ProductModalProps) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold">Nuevo Producto</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          className="border p-2 w-full my-1"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          className="border p-2 w-full my-1"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          className="border p-2 w-full my-1"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="border p-2 w-full my-1"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              onSave({
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
              });
              setNewProduct({
                name: "",
                description: "",
                price: "",
                stock: "",
              });
            }}
            className="bg-success text-white p-2 rounded"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-error text-white p-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
