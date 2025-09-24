
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {

  const phoneNumber = "5491167913596";
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp chat"
      className="
        fixed bottom-8 right-8 
        flex items-center justify-center 
        rounded-full shadow-lg
        bg-green-500 text-white 
        hover:scale-110 transition-transform 
        w-12 h-12 md:w-16 md:h-16
        z-1000
      "
    >
      <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8" />
    </a>
  );
  
}
