interface CardSolutionProps {
  Date: String;
  Title: string;
  Description: string;
  Department: string;
  Technician: string;
}

export default function CardSolution({
  Date,
  Title,
  Description,
  Department,
  Technician,
}: CardSolutionProps) {
  return (
    <div className="p-4 bg-[rgba(255,255,255,0.9)] backdrop-blur-sm rounded-xl shadow-sm transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
      <h3 className="font-semibold text-[#023059] mb-1">{Title}</h3>
      <p className="text-sm text-gray-600 mb-3">{Description}</p>
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <i className="fas fa-building mr-2"></i> {/* Icono */}
        <span>Departamento: {Department}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <i className="fas fa-user mr-2"></i> {/* Icono */}
        <span>Técnico: {Technician}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 ">{Date}</span>
        <button className="bg-white text-[#023059] border border-[#e5e7eb] rounded-lg py-2 px-4 font-medium transition-all duration-300 hover:bg-[#f9fafb] hover:shadow-sm text-sm">
          <i className="fas fa-eye mr-1"></i> {/* Icono */}
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
