// import { useTokenExpiry } from '../context/TokenExpiryContext';
// import { useNotify } from '../components/ToastProvider';

// export const useAuthFetch = () => {
//   const { handleTokenExpiry } = useTokenExpiry();
//   const notify = useNotify();

//   const authFetch = async (url, options = {}) => {
//     const token = localStorage.getItem('token');

//     const config = {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }),
//         ...options.headers,
//       },
//     };

//     try {
//       const response = await fetch(url, config);

//       // Detectar cualquier 401 y abrir modal
//       if (response.status === 401) {

//         // Parsear respuesta para verificar si es por token expirado
//         let errorData = {};
//         try {
//           errorData = await response.clone().json();
//         } catch (e) {
//         }

//         // Si es token expirado, mostrar modal
//         if (errorData.expired === true || errorData.error?.includes('expirado') || errorData.error?.includes('expired')) {
//           localStorage.removeItem('token');
//         } else {
//           // Solo notificar otros errores 401
//           notify.error(errorData.error || 'Acceso no autorizado');
//         }

//         return null; 
//       }

//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };

//   return { authFetch };
// };



import { useTokenExpiry } from '../context/TokenExpiryContext';
import { useNotify } from '../components/ToastProvider';
import { authFetch as baseAuthFetch } from '../components/utils/useFetch';

export const useAuthFetch = () => {
  const { handleTokenExpiry } = useTokenExpiry();
  const notify = useNotify();

  // devolvemos authFetch ya conectado al contexto
  const authFetch = (url, options = {}) =>
    baseAuthFetch(url, options, { handleTokenExpiry, notify });

  return { authFetch };
};
