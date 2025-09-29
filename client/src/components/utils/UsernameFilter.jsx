import { FaUser } from 'react-icons/fa';

export default function UsernameFilter({ username, setUsername, loading, className = '' }) {
    
  return (
    <div className={`bg-gray-50 rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col w-full">
        <label htmlFor="username" className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaUser className="text-gray-500" />
          Buscar por nombre de usuario
        </label>
        <div className="relative">  {/* Agrego un wrapper para overlay opcional */}
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej: Juan Pérez"
            // Removido: disabled={loading}  <- Esto era el culpable
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {/* Opcional: Indicador visual de loading sin deshabilitar */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}