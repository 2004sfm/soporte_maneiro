// src/app/Reportes/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CardUser from "@/Components/CardUser";
import CardDepartment from "@/Components/CardDepartament";
import DepartmentForm from "@/Components/DepartmentForm";
import UserForm from "@/Components/UserForm";
import EditDepartmentModal from "@/Components/EditDepartmentModal";
import EditUserModal from "@/Components/EditUserModal";

// --- Interfaces para la estructura de tus datos ---
interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface Department {
  id: string;
  name: string;
  director?: string;
}
// --------------------------------------------------

export default function ReportesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // --- Estados para controlar el Modal de Edición de Departamento ---
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>('');
  const [selectedDirectorName, setSelectedDirectorName] = useState<string>('');
  // -----------------------------------------------------------------

  // --- Estados para controlar el Modal de Edición de USUARIO ---
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // ------------------------------------------------------------------

  // Función para obtener TODOS los datos (usuarios y departamentos)
  // Esta función es la que llamaremos para recargar.
  const fetchAllData = async () => {
    try {
      const [usersRes, departmentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/`)
      ]);

      if (!usersRes.ok) throw new Error(`HTTP error! Usuarios: ${usersRes.status}`);
      if (!departmentsRes.ok) throw new Error(`HTTP error! Departamentos: ${departmentsRes.status}`);

      const usersData: User[] = await usersRes.json();
      const departmentsData: Department[] = await departmentsRes.json();

      setUsers(usersData);
      setDepartments(departmentsData);
      console.log('✅ Datos cargados (usuarios y departamentos).');
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      alert('Hubo un error al cargar los datos. Por favor, revisa la consola.');
    }
  };

  // useEffect se ejecuta una vez al montar para cargar los datos iniciales
  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Funciones para el control del Modal de Edición de Departamento ---
  const handleEditDepartment = (id: string, name: string, director: string) => {
    setSelectedDepartmentId(id);
    setSelectedDepartmentName(name);
    setSelectedDirectorName(director);
    setIsEditDepartmentModalOpen(true);
  };

  const handleCloseEditDepartmentModal = () => {
    setIsEditDepartmentModalOpen(false);
    setSelectedDepartmentId(null);
    setSelectedDepartmentName('');
    setSelectedDirectorName('');
  };

  const handleDepartmentUpdated = () => {
    console.log('🔄 Departamento actualizado. Refrescando la lista...');
    fetchAllData();
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este departamento? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${tuTokenDeAuth}` // Si tu API requiere autenticación
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error desconocido.' }));
        throw new Error(`HTTP error! Al eliminar departamento: ${res.status} - ${errorData.message || res.statusText}`);
      }

      console.log(`✅ Departamento con ID ${id} eliminado.`);
      alert('Departamento eliminado con éxito!');
      fetchAllData();
    } catch (error) {
      console.error('❌ Error al eliminar el departamento:', error);
      alert(`Error al eliminar el departamento: ${error}`);
    }
  };
  // ---------------------------------------------------

  // --- Funciones para el control del Modal de Edición de USUARIO ---
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleCloseEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    console.log('🔄 Usuario actualizado. Refrescando la lista...');
    fetchAllData();
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${tuTokenDeAuth}` // Si tu API requiere autenticación
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error desconocido.' }));
        throw new Error(`HTTP error! Al eliminar usuario: ${res.status} - ${errorData.message || res.statusText}`);
      }

      console.log(`✅ Usuario con ID ${id} eliminado.`);
      alert('Usuario eliminado con éxito!');
      fetchAllData();
    } catch (error) {
      console.error('❌ Error al eliminar el usuario:', error);
      alert(`Error al eliminar el usuario: ${error}`);
    }
  };
  // ---------------------------------------------------

  return (
    <main className="relative container mx-auto py-6 px-4 md:px-6">
      {/* Sección para Añadir Departamento */}
      <section className="p-4 mb-6 bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-[#023059] mb-4">
          Añadir Nuevo Departamento
        </h2>
        {/* Pasa fetchAllData como prop 'onDepartmentCreated' */}
        <DepartmentForm onDepartmentCreated={fetchAllData} />
      </section>

      {/* Lista de Departamentos */}
      <section className="p-4 mb-6 bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-[#023059] mb-4">
          Departamentos
        </h2>
        {departments.length > 0 ? (
          departments.map((dept) => (
            <CardDepartment
              key={dept.id}
              id={dept.id}
              Departament={dept.name}
              Director={dept.director || "N/A"}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />
          ))
        ) : (
          <p>Cargando departamentos o no hay departamentos disponibles.</p>
        )}
      </section>

      {/* Sección para Añadir Usuario */}
      <section className="p-4 mb-6 bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-[#023059] mb-4">
          Añadir Nuevo Usuario
        </h2>
        {/* Pasa fetchAllData como prop 'onUserCreated' */}
        <UserForm onUserCreated={fetchAllData} />
      </section>

      {/* Lista de Usuarios */}
      <section className="p-4 mb-6 bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-[#023059] mb-4">Usuarios</h2>
        {users.length > 0 ? (
          users.map((user) => (
            <CardUser
              key={user.id}
              id={user.id}
              User={user.username}
              Name={user.first_name}
              LastName={user.last_name}
              onEdit={() => handleEditUser(user)}
              onDelete={handleDeleteUser}
            />
          ))
        ) : (
          <p>Cargando usuarios o no hay usuarios disponibles.</p>
        )}
      </section>

      {/* Botón Volver */}
      <div className="flex justify-end mb-4">
        <Link
          href="/Home"
          className="inline-block bg-red-600 text-white rounded-lg py-2 px-4 font-semibold hover:bg-red-700 transition"
        >
          Volver
        </Link>
      </div>

      {/* --- El Modal de Edición de Departamento (Renderizado aquí) --- */}
      {isEditDepartmentModalOpen && selectedDepartmentId && (
        <EditDepartmentModal
          isOpen={isEditDepartmentModalOpen}
          onClose={handleCloseEditDepartmentModal}
          departmentId={selectedDepartmentId}
          currentDepartmentName={selectedDepartmentName}
          currentDirectorName={selectedDirectorName}
          onDepartmentUpdated={handleDepartmentUpdated}
        />
      )}
      {/* ------------------------------------------------------------- */}

      {/* --- El Modal de Edición de USUARIO (Renderizado aquí) --- */}
      {isEditUserModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditUserModalOpen}
          onClose={handleCloseEditUserModal}
          currentUser={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
      {/* ----------------------------------------------------------------- */}
    </main>
  );
}