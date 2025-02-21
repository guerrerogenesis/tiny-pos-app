// src/types/index.ts

export interface Sale {
  id: number;
  user_id: number;
  total_amount: number;
  created_at: string;
};
export interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};