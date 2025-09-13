export default function ActionButtonCard({ 
    id, 
    icon: Icon, 
    title, 
    description, 
    onClick, 
    isActive, 
    colorScheme 
}) {
    
    return (
        <button
            onClick={() => onClick(id)} 
            className={`flex flex-col items-center justify-center p-5 rounded-xl transition-all duration-200 border ${
                isActive 
                    ? `bg-${colorScheme}-50 border-${colorScheme}-200 shadow-inner` 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
            }`}
        >
            <div className={`p-3 rounded-full mb-3 ${
                isActive ? `bg-${colorScheme}-100 text-${colorScheme}-600` : 'bg-gray-100 text-gray-600'
            }`}>
                <Icon className="text-lg" />
            </div>
            <span className="font-medium text-gray-700">{title}</span>
            <p className="text-xs text-gray-500 mt-1 text-center">{description}</p>
        </button>
    );

}