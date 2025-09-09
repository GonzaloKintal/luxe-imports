
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Hero from '../components/home/hero/Hero';
import FeaturedProducts from '../components/featured-products/FeaturedProducts';

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
            <Hero />

            <main className="bg-gray-100 text-black">
                
                {/* Productos destacados */}
                <FeaturedProducts />
            </main>
            
        </>
    );
}