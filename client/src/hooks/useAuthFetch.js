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
      //
      const response = await fetch(url, config);
      //
      
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        //
        
        if (errorData.expired === true) {
          //
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