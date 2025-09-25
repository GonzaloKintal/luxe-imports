import React, { createContext, useContext, useState, useCallback } from 'react';

const TokenExpiryContext = createContext();

export const useTokenExpiry = () => {
  const context = useContext(TokenExpiryContext);
  if (!context) {
    throw new Error('useTokenExpiry debe usarse dentro de TokenExpiryProvider');
  }
  return context;
};

export const TokenExpiryProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTokenExpiry = useCallback(() => {
      // 
    if (!showModal) {
        // 
      setShowModal(true);
    }
  }, [showModal]);

  const closeModal = useCallback(() => {
     // 
    setShowModal(false);
    
    // Limpiar datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
     // 
     // 
    
    // Redirigir al home de forma simple y confiable
    window.location.href = '/';
    
  }, []);

  const value = {
    showModal,
    handleTokenExpiry,
    closeModal
  };

  return (
    <TokenExpiryContext.Provider value={value}>
      {children}
    </TokenExpiryContext.Provider>
  );
};