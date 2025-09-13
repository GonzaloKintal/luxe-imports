import { FaPlus, FaUserShield, FaTag } from 'react-icons/fa';
import ActionButtonCard from './ActionButtonCard';

export default function ActionButtonsList({ openForm, onFormOpen }) {

    const actions = [
        {
            id: 'product',
            icon: FaPlus,
            title: 'Crear Producto',
            description: 'Añadir nuevo item al catálogo',
            colorScheme: 'blue'
        },
        {
            id: 'admin',
            icon: FaUserShield,
            title: 'Crear Admin',
            description: 'Agregar nuevo administrador',
            colorScheme: 'green'
        },
        {
            id: 'category',
            icon: FaTag,
            title: 'Crear Categoría',
            description: 'Gestionar categorías de productos',
            colorScheme: 'purple'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {actions.map(action => (
                <ActionButtonCard
                    key={action.id}
                    id={action.id}
                    icon={action.icon}
                    title={action.title}
                    description={action.description}
                    onClick={onFormOpen}
                    isActive={openForm === action.id}
                    colorScheme={action.colorScheme}
                />
            ))}
        </div>
    );

}