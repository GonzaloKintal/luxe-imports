import { FaStar } from 'react-icons/fa';
import LightRays from './LightRays.jsx';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
            {/* Luz de fondo */}
            <div className="absolute inset-0 z-0 w-full h-full">
              <LightRays
                raysOrigin="top-center"
                raysColor="#ffffff"
                raysSpeed={1.5}
                lightSpread={0.8}
                rayLength={1.2}
                followMouse={true}
                mouseInfluence={0.1}
                noiseAmount={0.1}
                distortion={0.05}
                mobileScale={3.8} // Escala aumentada para mobile
                className="w-full h-full"
              />
            </div>

            {/* Overlay para mejorar legibilidad */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            {/* Contenido centrado */}
            <div className="relative z-10 text-center px-6">
              <h1 className="luxe-font text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                <span
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)',
                  }}
                >
                  LUXE
                </span>{" "}
                <span className="text-gray-400">IMPORTS</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 font-light text-gray-300 animate-fade-in-up">
                iPhones & Perfumes Importados
              </p>
              <p className="text-lg mb-10 max-w-2xl mx-auto text-gray-400 animate-fade-in-up delay-300">
                Calidad. Estilo. Confianza.
              </p>

              <div className="animate-bounce mt-16">
                <button
                  onClick={() => {
                    const section = document.getElementById("featured-products");
                    if (section) {
                      const y = section.getBoundingClientRect().top + window.scrollY - 50;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className="focus:outline-none cursor-pointer"
                >
                  <svg
                    className="w-8 h-8 mx-auto text-gray-400 hover:text-white transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                  </svg>
                </button>
              </div>

            </div>
        </section>
    );
}