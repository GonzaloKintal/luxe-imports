

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import ProductCard from '../../products/ProductCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function FeaturedProducts() {
    const navigate = useNavigate();
    const [destacados, setDestacados] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/featured`);
                const data = await res.json();
                setDestacados(data);
            } catch (error) {
                console.error("Error al obtener productos destacados:", error);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Productos Destacados
                </h2>
            </div>

            <Marquee pauseOnHover gradient={false} speed={40} className='py-4'>
                {destacados.map((prod) => (
                    <div className="w-[250px] flex-shrink-0 mx-2">
                        <ProductCard key={prod._id} {...prod} id={prod._id} onClick={() => navigate(`/products/product-detail/${prod._id}`)} />
                    </div>
                ))}
            </Marquee>

            <div className="text-center mt-12">
                <button
                    className="px-6 py-3 bg-transparent cursor-pointer text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300"
                    onClick={() => navigate('/products')}
                >
                    Ver todos los productos
                </button>
            </div>
        </section>
    );
}