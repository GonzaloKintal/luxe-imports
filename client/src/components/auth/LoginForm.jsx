import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginForm({ 
    formData, 
    onFormChange, 
    touchedFields, 
    onBlurField, 
    onSubmit, 
    loading,
    onForgot
}) {
    // Función para validar formato de email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Determinar si hay error en el email
    const hasEmailError = touchedFields.email && (!formData.email || !isValidEmail(formData.email));
    const emailErrorMessage = touchedFields.email && !formData.email 
        ? 'El email es obligatorio' 
        : touchedFields.email && !isValidEmail(formData.email) 
        ? 'Formato de email no válido' 
        : '';

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FaEnvelope /></span>
                    <input 
                        id="email"
                        name="email"
                        type="email"
                        autoComplete='email'
                        value={formData.email} 
                        onChange={onFormChange} 
                        onBlur={() => onBlurField('email')} 
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                            hasEmailError
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`} 
                        placeholder="tu@email.com"
                        required 
                    />
                </div>
                {emailErrorMessage && (
                    <span className="text-xs text-red-500 mt-1">{emailErrorMessage}</span>
                )}
            </div>
            
            <div>
                <label htmlFor="password" className="block text-gray-700 mb-2 text-sm font-medium">Contraseña</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FaLock /></span>
                    <input 
                        id="password"
                        name="password" 
                        type="password"
                        autoComplete='current-password'
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