import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginForm({ 
    formData, 
    onFormChange, 
    touchedFields, 
    onBlurField, 
    onSubmit, 
    loading,
    onForgot // <-- nuevo prop
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
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

            {/* Botón de iniciar sesión */}
            <button 
                type="submit" 
                className="w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md mt-4"
                disabled={loading}
                style={loading ? { opacity: 0.6, pointerEvents: 'none' } : {}}
            >
                <FaUserCircle /> {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>

            {/* Botón Olvidé mi contraseña */}
            <button
                type="button"
                onClick={onForgot}
                className="w-full mt-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 underline text-center"
            >
                Olvidé mi contraseña
            </button>
        </form>
    );
}
