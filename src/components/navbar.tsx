'use client';
import React from "react";
import { useAuth } from "@utils/authContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@public/images/logo.png";
import classNames from "classnames";

export default function Navbar() {
  const pathname = usePathname(); // detecta la página activa
  const {user, logout} = useAuth();
  const currenPageStyle = "bold text-secondary-100 underline";
  return (
    <header className="antialiased">
      <nav className="bg-white border-gray-200 ">
        <div className="flex flex-wrap justify-between items-center">
          <div className="basis-full flex justify-between items-center p-3 shadow">
            <a href="/dashboard" className="flex mr-4">
              <Image
                src={logo}
                width={36}
                height={36}
                className="mr-3 w-9 h-9"
                alt="Tiny Pos Logo"
              />
              <span className="self-center text-2xl md:text-3xl font-semibold whitespace-nowrap ">
                Tiny POS App
              </span>
            </a>
            <button onClick={()=> logout(user?.id)} className="text-xs md:text-base font-medium text-gray-500">
              Cerrar Sesión
            </button>
          </div>
          <div className="basis-full flex items-center justify-evenly md:justify-end md:gap-10 font-medium text-xs md:text-lg lg:order-2 p-3 max-w-6xl">
            <Link
              href={"/dashboard"}
              className={classNames(
                
                pathname === "/dashboard" ? currenPageStyle : ""
              )}
            >
              Inicio
            </Link>
            <Link
              href="/dashboard/sales"
              className={classNames(
                
                pathname === "/dashboard/sales" ? currenPageStyle : ""
              )}
            >
              Ventas
            </Link>
            <Link
              type="button"
              href="/dashboard/products"
              className={classNames(
                
                pathname === "/dashboard/products" ? currenPageStyle : ""
              )}
            >
              Productos
            </Link>
            <Link
              href="/dashboard/transactions"
              className={classNames(
                
                pathname === "/dashboard/transactions" ? currenPageStyle : ""
              )}
            >
              Transacciones
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
