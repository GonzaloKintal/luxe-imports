import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

export default function UsernameFilter({
  username,
  setUsername,
  loading = false,
  title = "Buscar por nombre de usuario",
  showTitle = true,
  className = ""
}) {

  const [open, setOpen] = useState(false);
  const [localUsername, setLocalUsername] = useState(username || "");

  function handleFilter() {
    setUsername(localUsername);
  }

  function handleClear() {
    setLocalUsername("");
    setUsername("");
  }

  return (
    <div className={`relative w-full mx-auto ${className}`}>
      <button
        type="button"
        className="w-full flex justify-between items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-900 font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        onClick={() => setOpen(o => !o)}
      >
        <span className='text-sm sm:text-base'>{showTitle ? title : "Buscar por nombre"}</span>
        <svg className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="relative mb-4 top-1 left-0 right-0 z-20 bg-white border border-gray-200 rounded-b-lg shadow-xl p-4 mt-1 animate-fadeInUp w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 items-end">
            <div className="flex flex-col min-w-0">
              <input
                type="text"
                id="username"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="flex flex-row gap-2 justify-end min-w-0">
              <button
                onClick={handleFilter}
                disabled={loading || !localUsername}
                className="w-full px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Filtrar
              </button>
              <button
                onClick={handleClear}
                disabled={loading || !localUsername}
                className="w-full px-4 py-1 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
