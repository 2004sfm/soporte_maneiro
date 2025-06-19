// src/Components/DepartmentForm.tsx
"use client";

import React, { useState, FormEvent } from "react";

interface DepartmentFormProps {
    onDepartmentCreated?: () => void; // Nueva prop opcional para el callback
}

export default function DepartmentForm({ onDepartmentCreated }: DepartmentFormProps) {
    const [name, setName] = useState("");
    const [director, setDirector] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const departmentData = { name, director };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(departmentData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Error: ${res.status} - ${JSON.stringify(errorData)}`);
            }

            alert("Departamento creado exitosamente!");
            setName(""); // Limpiar el formulario
            setDirector(""); // Limpiar el formulario
            onDepartmentCreated?.(); // Llama al callback para recargar los datos
        } catch (error: any) {
            console.error("Error al crear departamento:", error);
            alert(`Error al crear departamento: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-end gap-4"
        >
            <div className="flex-1 w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Departamento
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Recursos Humanos"
                    className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
                    required
                />
            </div>

            <div className="flex-1 w-full">
                <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-1">
                    Director
                </label>
                <input
                    type="text"
                    id="director"
                    name="director"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="border border-[#e5e7eb] rounded-lg py-2 px-3 w-full text-sm bg-white transition-all duration-300 focus:border-[#049DD9] focus:ring-3 focus:ring-[#049DD9]/20 outline-none"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-gradient-to-r from-[#049DD9] to-[#023059] text-white rounded-lg py-2 px-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#049DD9]/30 w-full md:w-auto"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Creando...' : 'Crear Departamento'}
            </button>
        </form>
    );
}