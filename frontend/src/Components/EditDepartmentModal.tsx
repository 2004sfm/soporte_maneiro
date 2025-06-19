// src/components/EditDepartmentModal.tsx
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";

// Interfaz para los datos que se enviarán a la API
interface UpdatedDepartmentData {
  name: string;
  director?: string; // Hazlo opcional si tu backend lo permite
}

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string; // ¡AHORA RECIBIMOS EL ID!
  currentDepartmentName: string;
  currentDirectorName: string;
  onDepartmentUpdated?: () => void; // Callback para notificar al padre
}

export default function EditDepartmentModal({
  isOpen,
  onClose,
  departmentId, // Usamos el ID
  currentDepartmentName,
  currentDirectorName,
  onDepartmentUpdated,
}: EditDepartmentModalProps) {
  // Estados para los campos del formulario, controlados por React
  const [newDepartmentName, setNewDepartmentName] = useState(currentDepartmentName);
  const [newDirectorName, setNewDirectorName] = useState(currentDirectorName);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para deshabilitar el botón

  // Este useEffect asegura que los inputs se actualicen si el modal se abre
  // para un departamento diferente (cuando cambian currentDepartmentName/currentDirectorName)
  useEffect(() => {
    setNewDepartmentName(currentDepartmentName);
    setNewDirectorName(currentDirectorName);
  }, [currentDepartmentName, currentDirectorName]);

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Manejador para el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Previene la recarga de la página
    setIsSubmitting(true); // Deshabilita el botón

    // Preparamos los datos para enviar
    const updatedData: UpdatedDepartmentData = {
      name: newDepartmentName,
      director: newDirectorName,
    };

    try {
      // Llamada a la API para actualizar el departamento
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/${departmentId}/`, {
        method: 'PUT', // O 'PATCH' si tu API es para actualizaciones parciales
        headers: {
          'Content-Type': 'application/json',
          // **IMPORTANTE**: Añade tu token de autenticación aquí si lo necesitas
          // 'Authorization': `Bearer ${tuTokenDeAutenticacion}`
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${JSON.stringify(errorData)}`);
      }

      console.log('✅ Departamento actualizado con éxito.');
      alert('Departamento actualizado con éxito!');
      onClose(); // Cierra el modal
      onDepartmentUpdated?.(); // Notifica al componente padre para que refresque la lista
    } catch (error: any) {
      console.error('❌ Error al actualizar el departamento:', error);
      alert(`Error al actualizar el departamento: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Habilita el botón de nuevo
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()} // Evita que un clic dentro del modal lo cierre
      >
        <h2 className="text-xl font-semibold text-[#023059] mb-4">
          Editar Departamento
        </h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Cerrar"
          disabled={isSubmitting} // Deshabilitado si se está enviando
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}> {/* Asignamos el manejador de envío */}
          {/* Nombre del Departamento */}
          <div className="mb-4">
            <label
              htmlFor="newDepartmentName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nuevo Nombre del Departamento
            </label>
            <input
              type="text"
              id="newDepartmentName"
              name="newDepartmentName"
              value={newDepartmentName} // Valor controlado por el estado
              onChange={(e) => setNewDepartmentName(e.target.value)} // Actualiza el estado
              placeholder="Ej: Marketing Digital"
              className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
              required
            />
          </div>

          {/* Nombre del Director */}
          <div className="mb-6">
            <label
              htmlFor="directorName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Director
            </label>
            <input
              type="text"
              id="directorName"
              name="directorName"
              value={newDirectorName} // Valor controlado por el estado
              onChange={(e) => setNewDirectorName(e.target.value)} // Actualiza el estado
              placeholder="Ej: María García"
              className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              disabled={isSubmitting} // Deshabilitado si se está enviando
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#049DD9] to-[#023059] text-white rounded-lg py-2 px-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#049DD9]/30"
              disabled={isSubmitting} // Deshabilitado mientras se envía
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}