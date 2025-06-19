// src/app/layout.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modalinforme from "@/Components/Modalinforme";
import ProfileDropdown from "@/Components/ProfileDropdown";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleLogout = () => {
    // lógica de logout aquí
  };

  return (

    <body className="min-h-screen bg-blue-500">
      {/* Header **sin tocar**, con su fondo semitransparente y blur */}
      <header className="py-3 px-4 md:px-6 bg-[rgba(255,255,255,0.1)] backdrop-blur-md text-white shadow-md relative z-[9999]">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="logo"
              className="mr-3"
            />
            <div>
              <h1 className="text-xl font-bold">Soporte Maneiro</h1>
              <p className="text-xs opacity-80">
                Gestión de historial de soporte técnico
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={openModal}
              className="flex items-center bg-gradient-to-r from-[#049DD9] to-[#023059] text-white rounded-lg py-2 px-4 font-semibold hover:shadow-lg transition"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Generar Reporte
            </button>
            <ProfileDropdown
              onCreateInforme={openModal}
              onCreateReporte={openModal}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Solo el main se difumina, el header queda intacto */}
      <main
        className={`container mx-auto p-4 md:p-6 transition-all ${isModalOpen ? "filter blur-md" : ""
          }`}
      >
        {children}
      </main>

      {isModalOpen && (
        <Modalinforme isOpen={isModalOpen} onClose={closeModal} />
      )}
    </body>

  );
}
