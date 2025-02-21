"use client";

import { useState, useEffect } from "react";
import LoadingSpiner from "@components/loadingSpiner";
interface Product {
  id: number;
  name: string;
  price: number;
}
interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
}
interface User {
  id: number;
  name: string;
}
interface createError{
  status: number;
  saleId?:number;
  message:string;
}
interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleItems: SaleItem[]) => Promise<void>; // <-- Asegurar que onSave recibe saleItems
  products: Product[];
  loadingSale: boolean;
  createError:createError;
}

export default function SaleModal({
  isOpen,
  onClose,
  onSave,
  products,
  loadingSale,
  createError
}: SaleModalProps) {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  useEffect(() => {
    if (!isOpen) {
      setSaleItems([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSaleItems([
      ...saleItems,
      { productId, quantity: 1, price: product.price },
    ]);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const updatedItems = [...saleItems];
    updatedItems[index].quantity = quantity;
    setSaleItems(updatedItems);
  };

  const removeProduct = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSaleItems([...saleItems]);
    onSave(saleItems);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      {loadingSale ? (
        <LoadingSpiner />
      ) : (
        <div className="flex flex-col justify-between bg-white p-4 m-2 rounded w-96 ">
          <div className="header flex flex-col justify-start">
            <h2 className="text-lg font-bold mb-4">Nueva Venta</h2>

            {/* Agregar Productos */}
            {products && products.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay productos disponibles
              </p>
            ) : (
              <select
                onChange={(e) => addProduct(Number(e.target.value))}
                className="w-full p-2 border rounded mb-4 shadow"
              >
                <option selected value="" disabled>
                  Añadir producto
                </option>

                {products &&
                  products.length > 0 &&
                  products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.id} - {product.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="body flex flex-col justify-start items-start">
            {/* Lista de Productos Agregados */}
            <span className="text-sm font-bold">Productos:</span>
            <ul className="flex flex-col gap-3 p-2 bg-primary-300 shadow-inner border border-slate-200 rounded overflow-y-auto w-full max-h-60">
              {saleItems.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <li
                    key={index}
                    className="flex justify-between items-center "
                  >
                    <span>{product?.id} - {product?.name}</span>
                    <div className="inline-flex items-center">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          updateQuantity(index, Number(e.target.value))
                        }
                        className="w-12 border text-center"
                      />
                      <button
                        onClick={() => removeProduct(index)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            {createError && createError.status !== 200 ?
            <p className="text-error text-sm">
              {createError.message}
            </p>:null}
            <div className="self-end mt-4">
              <span className="text-sm font-bold">Total: </span>
              <span className="text-sm font-bold text-right">
                ${" "}
                {saleItems
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          <div className="footer flex flex-col justify-start">
            {/* Botones */}
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="mr-2 p-2 border rounded bg-error text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="p-2 bg-secondary-100 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
