// src/Components/UserForm.tsx
"use client";

import React, { useState, FormEvent } from "react";

interface UserFormProps {
    onUserCreated?: () => void; // Nueva prop opcional para el callback
}

export default function UserForm({ onUserCreated }: UserFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const userData = {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Error: ${res.status} - ${JSON.stringify(errorData)}`);
            }

            alert("Usuario creado exitosamente!");
            setUsername(""); // Limpiar el formulario
            setPassword(""); // Limpiar el formulario
            setFirstName(""); // Limpiar el formulario
            setLastName(""); // Limpiar el formulario
            onUserCreated?.(); // Llama al callback para recargar los datos
        } catch (error: any) {
            console.error("Error al crear usuario:", error);
            alert(`Error al crear usuario: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-xl shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej: jdoe123"
                    className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
                    required
                />
            </div>
            <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ej: Juan"
                    className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
                    required
                />
            </div>
            <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                </label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ej: Pérez"
                    className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
                    required
                />
            </div>
            <div className="md:col-span-2 flex justify-end">
                <button
                    type="submit"
                    className="bg-gradient-to-r from-[#049DD9] to-[#023059] text-white rounded-lg py-2 px-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#049DD9]/30"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                </button>
            </div>
        </form>
    );
}