// ModalInforme.tsx
"use client";

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { createPortal } from 'react-dom';

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface FormData {
  subject: string;
  description: string;
  department: string;
  technician: string;
}

interface ModalInformeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
  onSuccess?: () => void;
}

export default function ModalInforme({ isOpen, onClose, onSubmit, onSuccess }: ModalInformeProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [technician, setTechnician] = useState('');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchDepartments = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/`);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data: Department[] = await res.json();
          setDepartments(data);
        } catch (error) {
          console.error('Error al cargar los departamentos:', error);
        }
      };

      const fetchTechnicians = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data: User[] = await res.json();
          const nonAdminTechnicians = data.filter(user => !user.is_staff);
          setTechnicians(nonAdminTechnicians);
        } catch (error) {
          console.error('Error al cargar los técnicos:', error);
        }
      };

      fetchDepartments();
      fetchTechnicians();

      setSubject('');
      setDescription('');
      setDepartment('');
      setTechnician('');
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function onClickOutside(e: MouseEvent) {
      if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const informeData: FormData = {
      subject,
      description,
      department,
      technician,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(informeData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al crear el informe:', errorData);
        alert(`Error al crear informe: ${JSON.stringify(errorData)}`);
      } else {
        alert('Informe creado con éxito!');
        onSubmit?.(informeData);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 backdrop-blur flex items-center justify-center">
      <div ref={modalContentRef} className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-[#023059]">Crear Informe</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#049DD9]"
              placeholder="Escribe el asunto del informe"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#049DD9]"
              rows={4}
              placeholder="Describe el problema o la solicitud"
              required
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#049DD9]"
              required
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="technician" className="block text-sm font-medium text-gray-700">Técnico Asignado</label>
            <select
              id="technician"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#049DD9]"
              required
            >
              <option value="">Selecciona un técnico</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>{tech.first_name} {tech.last_name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            >Cancelar</button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-[#049DD9] hover:bg-[#037bb1] rounded-lg"
            >Crear Informe</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}