import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenExpiry } from '../context/TokenExpiryContext';

export const useCheckToken = () => {
  const navigate = useNavigate();
  const { handleTokenExpiry } = useTokenExpiry();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleTokenExpiry();
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        handleTokenExpiry();
        return;
      }

      if (payload.role !== 'admin') {
        navigate('/');
      }
    } catch {
      handleTokenExpiry();
    }
  }, [navigate, handleTokenExpiry]);
};
