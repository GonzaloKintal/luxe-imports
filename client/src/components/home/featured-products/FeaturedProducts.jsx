

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import ProductCard from '../../products/ProductCard';
import ProductCardSkeleton from '../../products/ProductCardSkeleton';

const API_URL = import.meta.env.VITE_API_URL;

export default function FeaturedProducts() {
    const navigate = useNavigate();
    const [destacados, setDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/featured`);
                const data = await res.json();
                setDestacados(data);
            } catch (error) {
                console.error("Error al obtener productos destacados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const skeletonArray = Array.from({ length: 7 });

    return (
        <section id="featured-products" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Productos Destacados
                </h2>
            </div>

            <Marquee
                pauseOnHover={!isMobile}
                gradient={false}
                speed={40}
                className='py-4'
            >
                {loading
                    ? skeletonArray.map((_, idx) => (
                        <div key={idx} className="w-[250px] h-[440px] sm:h-[470px] flex-shrink-0 mx-2">
                            <ProductCardSkeleton />
                        </div>
                    ))
                    : destacados.map((prod) => (
                        <div key={prod._id} className="w-[250px] h-[440px] sm:h-[470px] flex-shrink-0 mx-2">
                            <ProductCard 
                                {...prod} 
                                id={prod._id} 
                                onClick={() => navigate(`/products/product-detail/${prod._id}`)} 
                            />
                        </div>
                    ))
                }
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