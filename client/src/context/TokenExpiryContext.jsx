
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io as socketIOClient } from 'socket.io-client';

const TokenExpiryContext = createContext();

// Flag global para prevenir múltiples ejecuciones
let isTokenExpiryHandled = false;

export const TokenExpiryProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const newSocket = socketIOClient(API_URL);
    setSocket(newSocket);
    socketRef.current = newSocket;

    const handleTokenExpiredEvent = (data) => {
      handleTokenExpiry();
    };

    newSocket.on('tokenExpired', handleTokenExpiredEvent);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('tokenExpired', handleTokenExpiredEvent);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleTokenExpiry = () => {
    // Verificar flag global primero
    if (isTokenExpiryHandled) {
      return;
    }

    // Marcar como manejado inmediatamente
    isTokenExpiryHandled = true;
    
    localStorage.removeItem('token');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset del flag al cerrar
    isTokenExpiryHandled = false;
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