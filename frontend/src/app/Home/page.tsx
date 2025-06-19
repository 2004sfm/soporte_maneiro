"use client";
import React, { useState, useEffect } from 'react';
import CardSolution from '@/Components/CardSolution';
import ModalInforme from '@/Components/Modalinforme';

interface Request {
  id: number;
  subject: string;
  description: string;
  department_name: string;
  technician_full_name: string;
  created_at: string;
}

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateDates = (): boolean => {
    if (!startDate && !endDate) {
      setDateError('');
      return true;
    }
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if ((start && isNaN(start.getTime())) || (end && isNaN(end.getTime()))) {
      setDateError('Formato de fecha inválido.');
      return false;
    }
    if (start && end && start > end) {
      setDateError('La fecha de inicio no puede ser mayor que la de fin.');
      return false;
    }
    setDateError('');
    return true;
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requests/`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) url += `?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data: Request[] = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Error al obtener los datos');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validateDates()) {
      fetchRequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [startDate, endDate]);

  const handleApplyFilters = () => {
    if (validateDates()) {
      fetchRequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-white text-[#023059] border border-[#e5e7eb] rounded-lg py-2 px-4 font-medium hover:bg-[#f9fafb] transition"
        >Crear nuevo informe</button>
      </div>

      <section className="bg-white shadow p-4 rounded-lg mb-6">
        <h2 className="font-semibold text-lg mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Fecha de inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Fecha de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>
        {dateError && <p className="text-red-500 text-sm mt-2">{dateError}</p>}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleApplyFilters}
            className="flex items-center bg-gradient-to-r from-[#049DD9] to-[#023059] text-white border-none rounded-lg py-2 px-4 font-semibold transition-all duration-300 relative overflow-hidden hover:shadow-lg hover:shadow-[#049DD9]/30"
          >Aplicar Filtros</button>
        </div>
      </section>

      <section>
        {loading && <p className="text-center">Cargando...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && requests.length === 0 && (
          <p className="text-center text-gray-500">No se encontraron informes.</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <CardSolution
              key={`${request.id}-${request.created_at}`}
              Date={new Date(request.created_at).toLocaleDateString()}
              Title={request.subject}
              Description={request.description}
              Department={request.department_name}
              Technician={request.technician_full_name}
            />
          ))}
        </div>
      </section>

      <ModalInforme
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRequests}
      />
    </main>
  );
}