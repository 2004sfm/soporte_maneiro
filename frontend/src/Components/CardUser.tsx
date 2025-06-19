// src/components/CardUser.tsx
"use client";

import React from "react";

interface CardUserProps {
  id: string; // Necesitamos el ID para la eliminación
  User: string;
  Name: string;
  LastName: string;
  onEdit: (user: { id: string; username: string; first_name: string; last_name: string }) => void;
  onDelete: (userId: string) => void; // Hacemos esta prop obligatoria ahora
}

export default function CardUser({
  id,
  User,
  Name,
  LastName,
  onEdit,
  onDelete, // Recibimos la función de eliminación
}: CardUserProps) {

  return (
    <div className="flex justify-between items-center p-4 bg-[rgba(255,255,255,0.9)] backdrop-blur-sm rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md mb-2">
      <div className="flex items-center gap-3">
        <p className="font-semibold text-[#023059]">{User}</p>
        <p className="text-gray-600">{Name}</p>
        <p className="text-gray-600">{LastName}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit({ id, username: User, first_name: Name, last_name: LastName })}
          className="bg-yellow-500 rounded-lg p-2 text-white hover:bg-yellow-600 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(id)} // Conectamos el botón con la función onDelete
          className="bg-red-700 rounded-lg p-2 text-white hover:bg-red-800 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}