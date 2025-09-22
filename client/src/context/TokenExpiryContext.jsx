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
    console.log('🔑 Token expirado detectado');
    if (!showModal) {
      console.log('📋 Mostrando modal de sesión expirada');
      setShowModal(true);
    }
  }, [showModal]);

  const closeModal = useCallback(() => {
    console.log('🚪 Cerrando sesión y redirigiendo al home');
    setShowModal(false);
    
    // Limpiar datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('🧹 Token y user eliminados');
    console.log('🏠 Redirigiendo al home...');
    
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