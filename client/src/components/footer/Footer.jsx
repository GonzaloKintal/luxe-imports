import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaHeart } from 'react-icons/fa';

const Footer = () => {

  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-light mb-4">
              <span className="luxe-font text-white">LUXE</span>
              <span className="luxe-font text-gray-400">IMPORTS</span>
            </h3>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed">
              Descubrí nuestra selección exclusiva de productos de tecnología y estilo. 
              Calidad premium y diseño innovador en cada artículo.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-5 uppercase tracking-wider text-gray-300">Enlaces</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-300"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products')}
                  className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-300"
                >
                  Productos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-300"
                >
                  Quienes Somos
                </button>
              </li>
            </ul>
          </div>
          
          {/* Redes sociales */}
          <div>
            <h4 className="text-lg font-semibold mb-5 uppercase tracking-wider text-gray-300">Redes</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/luxeimports.ar/" 
                target='_blank'
                className="bg-gray-800 hover:bg-black p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Síguenos en Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="https://www.tiktok.com/@luxeimports.ar"
                target='_blank'
                className="bg-gray-800 hover:bg-black p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Síguenos en TikTok"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>
            <p className="text-gray-500 mt-6 text-sm">
              Seguínos en nuestras redes para <br /> no perderte ninguna novedad
            </p>
          </div>
        </div>
        
        {/* Separador */}
        <div className="border-t border-gray-700 my-8"></div>
        
        {/* Copyright y créditos */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Luxe Imports. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Desarrollado por [].
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;