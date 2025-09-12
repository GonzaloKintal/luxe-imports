
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminActions from '../components/admin/actions/AdminActions';
import AdminProducts from '../components/admin/products/AdminProducts';

export default function AdminPanel() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Obtener usuario desde el token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }
        // Decodificar el token para obtener el rol
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload);
            if (payload.role !== 'admin') {
                navigate('/');
            }
        } catch {
            navigate('/auth');
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/products/`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [API_URL]);

    if (loading) return <div className="p-6 text-center">Cargando...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden min-h-screen w-full">
            <ToastContainer
                position="top-right"
                autoClose={2500}
                theme="light"
            />

            <div className="flex items-center flex-col relative z-10 px-6 py-20">
                <h1 className="text-4xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                    Panel de Administración
                </h1>

                <div className="mb-8 flex flex-col items-start relative w-full max-w-4xl">

                    {/* Acciones de administrador */}
                    <AdminActions
                        products={products}
                        setProducts={setProducts}
                        API_URL={API_URL}
                    />

                    {/* Administrador de productos */}
                    <AdminProducts
                        products={products}
                        setProducts={setProducts}
                        API_URL={API_URL}
                    />
                    
                </div>
            </div>
        </main>
    );
}