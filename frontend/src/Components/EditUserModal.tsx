// src/components/EditUserModal.tsx
"use client";

import React, { useState, useEffect, FormEvent } from "react"; // Importa useState y useEffect
import { createPortal } from "react-dom";

// Define la interfaz UserData con los campos exactos que espera tu API para un usuario
// Usaremos 'username', 'first_name', 'last_name' como en tu interfaz 'User' de ReportesPage.
// 'password' es opcional porque no siempre se va a cambiar.
interface UserAPIFormat {
  username: string;
  first_name: string;
  last_name: string;
  password?: string; // Opcional para enviar si se cambia
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  // currentUser ahora es del tipo User, que incluye el 'id'
  currentUser: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    // Otros campos que puedas necesitar, como email, etc.
  };
  onUserUpdated?: () => void; // Callback para notificar al padre sobre la actualización
}

export default function EditUserModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}: EditUserModalProps) {
  // Estados para controlar los inputs del formulario
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newFirstName, setNewFirstName] = useState(currentUser.first_name);
  const [newLastName, setNewLastName] = useState(currentUser.last_name);
  const [newPassword, setNewPassword] = useState(""); // La contraseña casi siempre se maneja por separado y se vacía por seguridad
  const [isSubmitting, setIsSubmitting] = useState(false); // Para deshabilitar el botón durante el envío

  // Sincroniza los estados del formulario con las props de currentUser
  // Esto es crucial para que el modal muestre los datos correctos cada vez que se abre
  useEffect(() => {
    setNewUsername(currentUser.username);
    setNewFirstName(currentUser.first_name);
    setNewLastName(currentUser.last_name);
    setNewPassword(""); // Siempre resetea la contraseña al abrir el modal
  }, [currentUser]); // Se ejecuta cuando el objeto currentUser cambia

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Datos a enviar a la API
    const updatedData: UserAPIFormat = {
      username: newUsername,
      first_name: newFirstName,
      last_name: newLastName,
    };

    // Solo incluye la contraseña si el usuario la ha introducido
    if (newPassword) {
      updatedData.password = newPassword;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${currentUser.id}/`, {
        method: 'PATCH', // O 'PATCH' si tu API de usuarios permite actualizaciones parciales
        headers: {
          'Content-Type': 'application/json',
          // **IMPORTANTE**: Si tu API requiere un token de autenticación (ej. JWT),
          // añádelo aquí: 'Authorization': `Bearer ${tuTokenDeAuth}`
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al actualizar usuario: ${res.status} - ${JSON.stringify(errorData)}`);
      }

      console.log('✅ Usuario actualizado en el backend:', await res.json());
      alert('Usuario actualizado con éxito!');
      onClose(); // Cierra el modal
      onUserUpdated?.(); // Notifica al padre que la lista debe ser refrescada
    } catch (error: any) {
      console.error('❌ Error al actualizar el usuario:', error);
      alert(`Error al guardar cambios: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Habilita el botón de nuevo
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-[#023059] mb-4">
          Editar Usuario
        </h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Cerrar"
          disabled={isSubmitting}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          {/* Usuario (Username) */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario (Username)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Ej: jdoe123"
              className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
              required
            />
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              placeholder="Ej: Juan"
              className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
              required
            />
          </div>

          {/* Apellido */}
          <div className="mb-4">
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              placeholder="Ej: Pérez"
              className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
              required
            />
          </div>

          {/* Contraseña (Opcional, solo si se quiere cambiar) */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nueva Contraseña (Dejar en blanco para no cambiar)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
            /> {/* No es 'required' aquí, porque es para cambiar */}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#049DD9] to-[#023059] text-white rounded-lg py-2 px-4 font-semibold hover:shadow-lg hover:shadow-[#049DD9]/30 transition-all"
              disabled={isSubmitting}
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