import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';

// TikTok Icon Component (since it's not in lucide-react)
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
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.tiktok.com/@luxeimports.ar',
      hoverEffect: 'hover:scale-110 hover:-translate-y-1'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      url: 'https://www.tiktok.com/@luxeimports.ar',
      hoverEffect: 'hover:scale-110 hover:rotate-6'
    }
  ];

return (
  <section className="relative w-full py-16 md:py-24 lg:py-32 bg-black overflow-hidden">
    {/* Animaciones de fondo */}
    <div className="absolute inset-0">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/3 w-[60%] h-[60%] bg-white/5 rounded-full blur-2xl animate-float" />
    </div>

    {/* Contenido */}
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`text-center transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 tracking-wide">
          Seguinos
        </h2>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Conectá con nosotros en nuestras redes sociales
        </p>

        {/* Decorative line */}
        <div
          className={`w-24 h-px bg-white mx-auto mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'scale-x-100' : 'scale-x-0'
          }`}
        />

        {/* Social Icons */}
        <div className="flex justify-center gap-16 md:gap-20">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <div
                key={social.name}
                className={`transform transition-all duration-700 delay-${(index + 1) * 100} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group relative block p-4 transition-all duration-300 ease-out
                    ${social.hoverEffect}
                    hover:opacity-70
                  `}
                  aria-label={`Seguinos en ${social.name}`}
                >
                  {/* Icon background circle */}
                  <div className="absolute inset-0 rounded-full border border-gray-600 group-hover:border-white transition-colors duration-300" />

                  {/* Icon */}
                  <IconComponent
                    className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10 transition-transform duration-300"
                    strokeWidth={1.5}
                  />

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                </a>

                {/* Label */}
                <p className="text-sm text-gray-300 mt-3 font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {social.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <div
          className={`mt-16 flex justify-center transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>

    {/* Estilos internos */}
    <style jsx>{`
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
    `}</style>
  </section>
);


};

export default Contact;
