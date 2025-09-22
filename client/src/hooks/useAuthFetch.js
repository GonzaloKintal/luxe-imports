import { useTokenExpiry } from '../context/TokenExpiryContext';
import { useNotify } from '../components/ToastProvider';

export const useAuthFetch = () => {
  const { handleTokenExpiry } = useTokenExpiry();
  const notify = useNotify();

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      console.log('🌐 Haciendo petición a:', url);
      const response = await fetch(url, config);
      console.log('📡 Respuesta status:', response.status);
      
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.log('🔍 Datos de error 401:', errorData);
        
        if (errorData.expired === true) {
          console.log('⚠️ Token expirado confirmado - activando modal');
          handleTokenExpiry();
          return null;
        }
        
        if (errorData.error) {
          notify.error(errorData.error);
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error en petición:', error);
      notify.error('Error de conexión');
      throw error;
    }
  };

  return { authFetch };
};