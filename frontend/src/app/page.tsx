import React from "react";
import Image from "next/image";

export default function Index() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8 z-10 overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-52 h-36 mx-auto relative overflow-hidden mb-4">
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={150}
              height={140}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-bold flex items-center justify-center text-[var(--primary)]">
            Soporte Maneiro
          </h1>
          <p className="text-gray-600 mt-2">
            Gestión de historial de soporte técnico
          </p>
        </div>

        <form className="space-y-6">
          <div className="relative mb-6">
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              required
              autoComplete="username"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition focus:border-[var(--secondary)] focus:ring-4 focus:ring-[rgba(4,157,217,0.2)] outline-none bg-[var(--white)] placeholder-gray-400"
            />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition focus:border-[var(--secondary)] focus:ring-4 focus:ring-[rgba(4,157,217,0.2)] outline-none bg-[var(--white)] placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center mt-6 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] text-[var(--white)] rounded-lg py-3 font-semibold relative overflow-hidden hover:shadow-md hover:shadow-[rgba(4,157,217,0.3)] transition"
          >
            Iniciar sesión
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
