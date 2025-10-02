
import React, { createContext, useContext, useState } from 'react';

const TokenExpiryContext = createContext();

export const TokenExpiryProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    window.location.href = '/'; 
  };

  return (
    <TokenExpiryContext.Provider value={{ 
      showModal, 
      handleTokenExpiry, 
      closeModal
    }}>
      {children}
    </TokenExpiryContext.Provider>
  );
};

export const useTokenExpiry = () => useContext(TokenExpiryContext);
