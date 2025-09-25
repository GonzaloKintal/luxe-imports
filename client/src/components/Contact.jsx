import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useRef } from "react";
import { Instagram } from "lucide-react";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// TikTok Icon Component
const TikTokIcon = ({ className, strokeWidth = 1.5 }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/luxeimports.ar",
      hoverEffect: "hover:scale-110 hover:-translate-y-1",
      color: "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: "https://www.tiktok.com/@luxeimports.ar",
      hoverEffect: "hover:scale-110 hover:rotate-6",
      color: "bg-gradient-to-tr from-black via-gray-800 to-pink-600",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: "https://wa.me/5491122334455",
      hoverEffect: "hover:scale-110 hover:-rotate-6",
      color: "bg-gradient-to-tr from-green-400 to-green-600",
    },
  ];

  // Inject global styles for slick dots and background animations
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('contact-slick-style')) {
      const style = document.createElement('style');
      style.id = 'contact-slick-style';
      style.innerHTML = `
        .slick-dots li button:before {
          color: white !important;
          font-size: 12px;
          opacity: 0.6;
        }
        .slick-dots li.slick-active button:before {
          color: #22c55e !important;
          opacity: 1;
        }
        .slick-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: transparent;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const reviews = [
    {
      name: "Sofía R.",
      review: "Excelente atención desde el primer momento. Me guiaron en todo el proceso de compra y me sentí muy acompañada. Los productos llegaron en perfectas condiciones y se nota que son originales y de gran calidad.",
      stars: 5
    },
    {
      name: "Martín G.",
      review: "La experiencia fue impecable. Me asesoraron en cada detalle, resolvieron mis dudas al instante y la compra resultó súper sencilla. Además, los tiempos de entrega fueron rápidos y todo vino muy bien empaquetado.",
      stars: 5
    },
    {
      name: "Valentina P.",
      review: "Quedé sorprendida con la rapidez del envío y la calidad del producto. Desde la atención hasta la presentación, todo fue excelente. Es un alivio encontrar un lugar confiable donde sé que lo que compro es original.",
      stars: 5
    }
  ];

  const sliderRef = useRef(null);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true,
    swipe: true,
    autoplay: false,
    appendDots: dots => (
      <div className="mt-6">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <button className="w-3 h-3 rounded-full bg-white/40 border-2 border-white focus:outline-none transition-all duration-200" />
    ),
  };

  return (

    <section className="relative w-full bg-black overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-[60%] h-[60%] bg-white/5 rounded-full blur-2xl animate-float" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto w-full px-2 sm:px-6 py-10 md:py-20">
        <Slider ref={sliderRef} {...sliderSettings}>
          {/* Slide 1: Redes Sociales */}
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-10">
            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-10 text-center">
              Seguinos en nuestras redes
            </h3>
            <p className="text-gray-100 text-lg md:text-xl font-light mb-12 leading-relaxed text-center max-w-2xl mx-auto">
              Conectá con nosotros en nuestras redes sociales y sé parte de nuestra comunidad. No te pierdas ninguna novedad, promoción o lanzamiento.
            </p>

            {/* Botones redes sociales */}
            <div className="flex justify-center gap-10 md:gap-16">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full shadow-2xl ${social.color} ${social.hoverEffect} transition-all duration-500`}
                  >
                    {/* Icono */}
                    <IconComponent
                      className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10 transition-transform duration-500 group-hover:scale-125"
                      strokeWidth={1.5}
                    />

                    {/* Efecto Glow */}
                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

                    {/* Borde animado */}
                    <span className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin-slow group-hover:border-white/40"></span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Slide 2: Reseñas */}
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-10">
            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-10 text-center">
              Lo que opinan nuestros clientes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center border border-white/10 hover:scale-[1.03] transition-transform duration-300"
                >
                  <div className="flex gap-1 mb-2">
                    {[...Array(r.stars)].map((_, idx) => (
                      <FaStar key={idx} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-100 text-base mb-2">"{r.review}"</p>
                  <span className="text-gray-300 text-xs font-light">{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slide 3: Cómo comprar */}
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-10">
            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-6 text-center">
              ¿Cómo comprar en Luxe Imports?
            </h3>
            <ol className="list-decimal list-inside text-gray-200 text-lg space-y-3 mb-10 text-left max-w-xl mx-auto">
              <li><span className="font-semibold text-white">Registrate</span> en nuestra web.</li>
              <li><span className="font-semibold text-white">Llená tu carrito</span> con los productos que necesitás.</li>
              <li>Cuando estés listo, hacé click en <span className="font-semibold text-white">"Finalizar compra"</span>.</li>
              <li>Serás dirigido automáticamente a nuestro <span className="font-semibold text-green-400">WhatsApp</span> para coordinar el pago y la entrega de forma personalizada y segura.</li>
            </ol>

            {/* Botón de WhatsApp */}
            <div className="mt-auto flex justify-center">
              <a
                href="https://wa.me/5491122334455"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FaWhatsapp className="w-6 h-6" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </Slider>
      </div>

    </section>
  );
};

export default Contact;
