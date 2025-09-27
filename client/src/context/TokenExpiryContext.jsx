// import React, { createContext, useContext, useState } from 'react';

// const TokenExpiryContext = createContext();

// export const TokenExpiryProvider = ({ children }) => {
//   const [showModal, setShowModal] = useState(false);

//   const handleTokenExpiry = () => {
    
//     // Limpiar token primero
//     localStorage.removeItem('token');
    
//     // Mostrar modal
//     setShowModal(true);

//   };

//   const closeModal = () => {
//     setShowModal(false);
//     window.location.href = '/'; 
//   };

//   return (
//     <TokenExpiryContext.Provider value={{ showModal, handleTokenExpiry, closeModal }}>
//       {children}
//     </TokenExpiryContext.Provider>
//   );
// };

// export const useTokenExpiry = () => useContext(TokenExpiryContext);


import React, { createContext, useContext, useState, useEffect } from 'react';
import { io as socketIOClient } from 'socket.io-client';

const TokenExpiryContext = createContext();

export const TokenExpiryProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // Obtener la URL de la API del entorno (usa la misma que tienes en tu app)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Crear conexión WebSocket
    const newSocket = socketIOClient(API_URL);
    setSocket(newSocket);
    
    console.log('🔌 Conectando WebSocket para token expiry...');
    
    // Escuchar evento de token expirado
    newSocket.on('tokenExpired', (data) => {
      console.log('⚠️ Token expirado recibido por WebSocket:', data);
      handleTokenExpiry();
    });
    
    newSocket.on('connect', () => {
      console.log('✅ WebSocket conectado para token expiry');
    });
    
    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado para token expiry');
    });
    
    // Cleanup al desmontar
    return () => {
      console.log('🔌 Desconectando WebSocket token expiry...');
      newSocket.disconnect();
    };
  }, []);

  const handleTokenExpiry = () => {
    console.log('🚪 Manejando expiración de token...');
    
    // Limpiar token del localStorage
    localStorage.removeItem('token');
    
    // Mostrar modal
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Redirigir a la página de inicio
    window.location.href = '/'; 
  };

  return (
    <TokenExpiryContext.Provider value={{ 
      showModal, 
      handleTokenExpiry, 
      closeModal,
      socket 
    }}>
      {children}
    </TokenExpiryContext.Provider>
  );
};

export const useTokenExpiry = () => useContext(TokenExpiryContext);