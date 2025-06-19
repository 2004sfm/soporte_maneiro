// src/Components/ProfileDropdown.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface ProfileDropdownProps {
  onCreateInforme: () => void;
  onCreateReporte: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  onCreateInforme,
  onCreateReporte,
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center bg-white text-[#023059] border border-[#e5e7eb] rounded-lg py-2 px-4 font-medium hover:bg-[#f9fafb] transition"
      >
        <i className="fas fa-user-circle mr-2"></i>
        Perfil
        <i className="fas fa-chevron-down ml-2 text-xs"></i>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              onCreateInforme();
            }}
            className="w-full text-left px-4 py-2 text-sm text-[#023059] hover:bg-[#f9fafb] transition"
          >
            <i className="fas fa-file-alt mr-2 text-[#049DD9]"></i>
            Crear Informe Técnico
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onCreateReporte();
            }}
            className="w-full text-left px-4 py-2 text-sm text-[#023059] hover:bg-[#f9fafb] transition"
          >
            <i className="fas fa-chart-bar mr-2 text-[#049DD9]"></i>
            Crear Reporte
          </button>
          <a href="/Reportes"> <button
            className="w-full text-left px-4 py-2 text-sm text-[#023059] hover:bg-[#f9fafb] transition"
          >
            <i className="fas fa-chart-bar mr-2 text-[#049DD9]"></i>
            Admin
          </button>
          </a>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-[#023059] border-t border-gray-200 hover:bg-[#f9fafb] transition"
          >
            <i className="fas fa-sign-out-alt mr-2 text-red-500"></i>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
