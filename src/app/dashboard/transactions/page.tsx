"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@utils/authContext";
import LoadingSpiner from "@components/loadingSpiner";

import { fetchTransactions } from "@api/transactions";
interface Transaction {
  id: number;
  user_id: string;
  event_type: string;
  created_at: string;
}

export default function Transactions() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading]);

  useEffect(() => {
    fetchTransactions().then((data) => {
      setTransactions(data);
    });
  }, []);

  if (loading || !user) return <LoadingSpiner />;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-end items-end gap-2 ">
        <button
          onClick={fetchTransactions}
          className="bg-primary-100 text-white text-xs p-1.5 rounded max-w-max"
        >
          🔄 Refrescar
        </button>
      </div>
      <h1 className="text-2xl font-bold">🔄 Historial de Transacciones</h1>

      <table className="w-full border-collapse border rounded border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left">
            <th className="p-2 border border-gray-300">Usuario</th>
            <th className="p-2 border border-gray-300">Evento</th>
            <th className="p-2 border border-gray-300">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="border border-gray-300">
                <td className="p-2 border border-gray-300">
                  {transaction.user_id}
                </td>
                <td className="p-2 border border-gray-300">
                  {transaction.event_type}
                </td>
                <td className="p-2 border border-gray-300">
                  {transaction.created_at}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                No hay transacciones disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
