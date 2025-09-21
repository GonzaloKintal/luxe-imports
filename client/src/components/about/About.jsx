import React, { useEffect } from "react";
import { motion } from "framer-motion";

const About = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden min-h-screen">
      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        
        {/* Título con animación */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-extrabold text-black mb-10 text-center drop-shadow-lg"
        >
          Sobre Nosotros
        </motion.h1>

        {/* Sección principal */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* Columna Texto */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6"
          >
<<<<<<< HEAD
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Somos Diego y Sabrina
            </h2>
=======
            <div className="flex items-center gap-4">
              <img 
                src="/assets/logos/logo1.png" 
                alt="Logo Luxe Imports"
                className="w-16 h-16 rounded-full shadow-md object-cover"
              />
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Somos Diego y Sabrina
              </h2>
            </div>
>>>>>>> e761e2de490956ff5d46b50a4dbe085e0a66ac95
            <p className="text-gray-700 text-lg leading-relaxed">
              Fundadores de <span className="font-semibold text-black">Luxe Imports</span>, 
              un proyecto nacido de nuestra pasión por acercar a la gente productos exclusivos 
              de calidad internacional. Nos especializamos en traer los mejores 
              <span className="font-medium"> iPhones, accesorios premium y perfumes importados </span> 
              directamente hacia vos, con la confianza y cercanía que merecés.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Creemos que el lujo debe ser accesible y que cada compra tiene que sentirse 
              como una experiencia única. Por eso trabajamos día a día para ofrecerte 
              <span className="font-medium"> precios competitivos, atención personalizada </span> 
              y la seguridad de comprar productos 100% originales.
            </p>

            <blockquote className="text-xl font-semibold text-black italic border-l-4 border-black pl-4">
              En Luxe Imports no solo vendemos productos, te acercamos el estilo, 
              la calidad y la confianza de comprar lo mejor.
            </blockquote>
          </motion.div>

          {/* Columna Imagen */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-72 h-72 rounded-2xl shadow-xl overflow-hidden"
            >
              <img
                src="https://placehold.co/500x500"
                alt="Diego y Sabrina"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
};

export default About;
