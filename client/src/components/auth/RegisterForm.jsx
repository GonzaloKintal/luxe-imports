import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function RegisterForm({ 
    formData, 
    onFormChange, 
    touchedFields, 
    onBlurField, 
    onSubmit 
}) {
    // Validación para teléfono internacional
    const telefono = formData.telefono || '';
    const telefonoTouched = touchedFields.telefono;
    const telefonoRegex = /^\+\d{8,15}$/;
    const telefonoError = telefonoTouched && !telefonoRegex.test(telefono.trim());

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">Nombre</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400"><FaUser /></span>
                        <input 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={onFormChange} 
                            onBlur={() => onBlurField('firstName')} 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                touchedFields.firstName && !formData.firstName 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                            }`} 
                            placeholder="Nombre"
                            required 
                        />
                    </div>
                    {touchedFields.firstName && !formData.firstName && (
                        <span className="text-xs text-red-500 mt-1">Requerido</span>
                    )}
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">Apellido</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400"><FaUser /></span>
                        <input 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={onFormChange} 
                            onBlur={() => onBlurField('lastName')} 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                touchedFields.lastName && !formData.lastName 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                            }`} 
                            placeholder="Apellido"
                            required 
                        />
                    </div>
                    {touchedFields.lastName && !formData.lastName && (
                        <span className="text-xs text-red-500 mt-1">Requerido</span>
                    )}
                </div>
            </div>
            
            <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FaEnvelope /></span>
                    <input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={onFormChange} 
                        onBlur={() => onBlurField('email')} 
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                            touchedFields.email && !formData.email 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`} 
                        placeholder="tu@email.com"
                        required 
                    />
                </div>
                {touchedFields.email && !formData.email && (
                    <span className="text-xs text-red-500 mt-1">El email es obligatorio</span>
                )}
            </div>
            
            <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">Contraseña</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FaLock /></span>
                    <input 
                        name="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={onFormChange} 
                        onBlur={() => onBlurField('password')} 
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                            touchedFields.password && !formData.password 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`} 
                        placeholder="••••••••"
                        required 
                    />
                </div>
                {touchedFields.password && !formData.password && (
                    <span className="text-xs text-red-500 mt-1">La contraseña es obligatoria</span>
                )}
            </div>

            <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">Teléfono</label>
                <div className="relative">
                    <input
                        name="telefono"
                        type="tel"
                        value={formData.telefono || ''}
                        onChange={onFormChange}
                        onBlur={() => onBlurField('telefono')}
                        className={`w-full pl-4 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                            telefonoTouched && !telefonoRegex.test(telefono.trim())
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        placeholder="Ej: +54 11 2345 6789"
                        required
                    />
                </div>
                {telefonoError && (
                    <span className="text-xs text-red-500 mt-1">Formato internacional requerido. Ejemplo: +54 11 2345 6789</span>
                )}
            </div>
            
            <button 
                type="submit" 
                className="w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md mt-2"
            >
                <FaUserPlus /> Registrarse
            </button>
        </form>
    );
}