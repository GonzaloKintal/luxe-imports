import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">LUXE<span className="text-gray-400">IMPORTS</span></h3>
            <p className="mt-2 text-gray-400">Estilo y tecnología</p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <p className="text-gray-400">© {new Date().getFullYear()} Luxe Imports. Todos los derechos reservados.</p>
          </div>
          
          <div>
            <p className="text-gray-400">Creado por @diegoomaza y @sabrischmid</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;