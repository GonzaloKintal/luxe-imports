
import { useTokenExpiry } from '../context/TokenExpiryContext';
import { useNotify } from '../components/common/ToastProvider';
import { authFetch as baseAuthFetch } from '../components/utils/useFetch';

export const useAuthFetch = () => {
  const { handleTokenExpiry } = useTokenExpiry();
  const notify = useNotify();

  const authFetch = async (url, options = {}) => {
    try {
      const res = await baseAuthFetch(url, options);
      if (!res) throw new Error('Token expirado o error en fetch'); // fuerza el catch
      return res;
    } catch (err) {
      handleTokenExpiry();
      notify(err.message || 'Error de autenticación');
      return null;
    }
  };

  return { authFetch };
};
