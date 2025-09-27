// utils/authFetch.js
export const authFetch = async (url, options = {}, { handleTokenExpiry, notify } = {}) => {
  const token = localStorage.getItem('token');

  // Si no hay token
  if (!token) {
    if (handleTokenExpiry) handleTokenExpiry();
    return null;
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      let errorData = {};
      try {
        errorData = await response.clone().json();
      } catch (e) {}

      if (
        errorData.expired === true ||
        errorData.error?.includes('expirado') ||
        errorData.error?.includes('expired')
      ) {
        if (handleTokenExpiry) handleTokenExpiry();
        return null;
      } else {
        if (notify) notify.error(errorData.error || 'Acceso no autorizado');
      }

      return null;
    }

    return response;
  } catch (error) {
    console.error('Error en authFetch:', error);
    throw error;
  }
};
