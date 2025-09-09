

import { useNavigate } from 'react-router-dom';
import Marquee from "react-fast-marquee";
import ProductCard from '../products/ProductCard';

export default function FeaturedProducts() {
    const navigate = useNavigate();
    
    // Mock productos destacados
    const destacados = [
        {
            title: 'iPhone 15 Pro',
            price: 899999,
            img: 'https://placehold.co/300x200?text=iPhone+15+Pro',
            tag: 'iPhone',
        },
        {
            title: 'Perfume Tom Ford',
            price: 45999,
            img: 'https://placehold.co/300x200?text=Tom+Ford',
            tag: 'Perfumes',
        },
        {
            title: 'iPhone 14',
            price: 699999,
            img: 'https://placehold.co/300x200?text=iPhone+14',
            tag: 'iPhone',
        },
        {
            title: 'iPhone 12 Pro Max',
            price: 599999,
            img: 'https://placehold.co/300x200?text=iPhone+14',
            tag: 'iPhone',
        },
    ];

     return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Productos Destacados
                </h2>
            </div>

            <Marquee pauseOnHover gradient={false} speed={40} className='py-4'>
                {destacados.map((prod, idx) => (
                    <ProductCard key={idx} {...prod} />
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