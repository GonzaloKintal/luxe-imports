import React, { createContext, useContext, useState } from 'react';

const TokenExpiryContext = createContext();

export const TokenExpiryProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTokenExpiry = () => {
    console.log('🔔 handleTokenExpiry llamado');
    console.log('📋 Estado actual showModal:', showModal);
    
    // Limpiar token primero
    localStorage.removeItem('token');
    console.log('🗑️ Token eliminado del localStorage');
    
    // Mostrar modal
    setShowModal(true);
    console.log('✅ Modal debería mostrarse ahora');
  };

  const closeModal = () => {
    console.log('❌ Cerrando modal y redirigiendo');
    setShowModal(false);
    window.location.href = '/'; 
  };

  return (
    <TokenExpiryContext.Provider value={{ showModal, handleTokenExpiry, closeModal }}>
      {children}
    </TokenExpiryContext.Provider>
  );
};

export const useTokenExpiry = () => useContext(TokenExpiryContext);