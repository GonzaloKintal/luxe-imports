import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Función para actualizar carrito de forma inteligente
    const updateCart = (newCart) => {
        // Solo actualizar si hay diferencias reales
        if (JSON.stringify(cart) !== JSON.stringify(newCart)) {
            setCart(newCart);
        }
    };

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            setCart: updateCart, 
            addToCart,
            isLoading,
            setIsLoading
        }}>
            {children}
        </CartContext.Provider>
    );
}
