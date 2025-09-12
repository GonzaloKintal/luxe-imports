
import { useEffect } from 'react';
import Hero from '../components/home/hero/Hero';
import FeaturedProducts from '../components/home/featured-products/FeaturedProducts';

export default function Home() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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