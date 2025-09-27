// import React from 'react';
// import { useTokenExpiry } from '../context/TokenExpiryContext';

// const TokenExpiryModal = () => {
//   const { showModal, closeModal } = useTokenExpiry();


//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-lg mx-4 shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
//         <div className="text-center">
//           {/* Icono elegante con gradiente sutil */}
//           <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 mb-8 shadow-lg">
//             <svg className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
//             </svg>
//           </div>
          
//           {/* Título elegante */}
//           <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
//             Sesión Expirada
//           </h3>
          
//           {/* Descripción refinada */}
//           <p className="text-gray-600 mb-8 leading-relaxed font-light text-lg">
//             Tu sesión ha expirado por motivos de seguridad.
//             <br />
//             <span className="text-gray-500 text-base">
//               Serás redirigido para continuar navegando.
//             </span>
//           </p>
          
//           {/* Línea divisoria elegante */}
//           <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
          
//           {/* Información adicional con estilo minimal */}
//           <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8">
//             <div className="flex items-center justify-center mb-3">
//               <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-sm font-medium text-gray-700">Información</span>
//             </div>
//             <p className="text-sm text-gray-600 leading-relaxed">
//               Podrás navegar libremente por el sitio o iniciar sesión nuevamente cuando lo desees.
//             </p>
//           </div>
          
//           {/* Botón elegante */}
//           <button
//             onClick={closeModal}
//             className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98]"
//           >
//             <span className="flex items-center justify-center">
//               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//               Ir al Inicio
//             </span>
//           </button>
          
//           {/* Texto pequeño elegante */}
//           <p className="text-xs text-gray-400 mt-6 font-light tracking-wide">
//             Tus datos permanecen seguros y protegidos
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TokenExpiryModal;


import React, { useEffect } from 'react';
import { useTokenExpiry } from '../context/TokenExpiryContext';

const TokenExpiryModal = () => {
  const { showModal, closeModal } = useTokenExpiry();

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      console.log('🔒 Modal de token expirado mostrado - scroll bloqueado');
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Manejar tecla ESC para cerrar (opcional)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showModal) {
        console.log('⌨️ Modal cerrado con tecla ESC');
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal, closeModal]);

  if (!showModal) return null;

  const handleCloseModal = () => {
    console.log('🚪 Cerrando modal y redirigiendo al inicio...');
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-lg mx-4 shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center">
          {/* Icono elegante con gradiente sutil */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 mb-8 shadow-lg">
            <svg className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          
          {/* Título elegante */}
          <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
            Sesión Expirada
          </h3>
          
          {/* Descripción refinada */}
          <p className="text-gray-600 mb-8 leading-relaxed font-light text-lg">
            Tu sesión ha expirado por motivos de seguridad.
            <br />
            <span className="text-gray-500 text-base">
              Serás redirigido para continuar navegando.
            </span>
          </p>
          
          {/* Línea divisoria elegante */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
          
          {/* Información adicional con estilo minimal */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center mb-3">
              <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Información</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Podrás navegar libremente por el sitio o iniciar sesión nuevamente cuando lo desees.
            </p>
          </div>
          
          {/* Botón elegante */}
          <button
            onClick={handleCloseModal}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98]"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ir al Inicio
            </span>
          </button>
          
          {/* Texto pequeño elegante */}
          <p className="text-xs text-gray-400 mt-6 font-light tracking-wide">
            Tus datos permanecen seguros y protegidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryModal;