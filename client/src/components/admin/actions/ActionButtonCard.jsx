import { red } from "@mui/material/colors";

export default function ActionButtonCard({ 
    id, 
    icon: Icon, 
    title, 
    description, 
    onClick, 
    isActive, 
    colorScheme 
}) {
    
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            iconBg: 'bg-blue-100',
            iconText: 'text-blue-600'
        },
        red: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            iconBg: 'bg-red-100',
            iconText: 'text-red-600'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            iconBg: 'bg-purple-100',
            iconText: 'text-purple-600'
        }
    };

    const activeClasses = isActive ? colorClasses[colorScheme] : {
        bg: 'bg-white',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        iconText: 'text-gray-600'
    };

    return (
        <button
            onClick={() => onClick(id)} 
            className={`flex flex-col items-center justify-center 
                p-3 sm:p-4 md:p-5
                rounded-xl transition-all duration-200 border ${
                    isActive 
                        ? `${activeClasses.bg} ${activeClasses.border} shadow-inner` 
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                }`}
        >
            <div className={`p-2 sm:p-2.5 md:p-3 rounded-full mb-2 sm:mb-3 md:mb-3 ${activeClasses.iconBg} ${activeClasses.iconText}`}>
                <Icon className="text-base sm:text-lg md:text-lg" /> {/* ícono más pequeño en mobile */}
            </div>
            <span className="font-medium text-gray-700 text-sm sm:text-base">{title}</span>
            <p className="text-xs sm:text-xs md:text-xs text-gray-500 mt-1 text-center">{description}</p>
        </button>
    );
    
}