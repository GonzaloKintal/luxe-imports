import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function RegisterForm({
    formData,
    onFormChange,
    touchedFields,
    onBlurField,
    onSubmit,
    loading
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

    // Validación para teléfono internacional (react-phone-input-2 ya valida formato)
    const telefono = formData.telefono || '';
    const telefonoTouched = touchedFields.telefono;
    const telefonoError = telefonoTouched && (!telefono || telefono.length < 12);

    return (
    <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-2 text-sm font-medium">
                        Nombre
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400"><FaUser /></span>
                        <input
                        id="firstName"
                        name="firstName"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={onFormChange}
                        onBlur={() => onBlurField('firstName')}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                            placeholder:text-sm sm:placeholder:text-base
                            ${touchedFields.firstName && !formData.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nombre"
                        required
                        />
                    </div>
                    {touchedFields.firstName && !formData.firstName && (
                        <span className="text-xs text-red-500 mt-1">Requerido</span>
                    )}
                    </div>

                    <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-2 text-sm font-medium">
                        Apellido
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400"><FaUser /></span>
                        <input
                        id="lastName"
                        name="lastName"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={onFormChange}
                        onBlur={() => onBlurField('lastName')}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                            placeholder:text-sm sm:placeholder:text-base
                            ${touchedFields.lastName && !formData.lastName ? 'border-red-500' : 'border-gray-300'}`}
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
                <label htmlFor="email" className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FaEnvelope /></span>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={onFormChange}
                        onBlur={() => onBlurField('password')}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${touchedFields.password && !formData.password
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
                <label htmlFor="telefono" className="block text-gray-700 mb-2 text-sm font-medium">Teléfono</label>
                <PhoneInput
                    id="telefono"
                    country="ar"
                    value={formData.telefono || ''}
                    onChange={value => onFormChange({ target: { name: 'telefono', value } })}
                    onBlur={() => onBlurField('telefono')}
                    inputProps={{
                        name: 'telefono',
                        required: true,
                        autoFocus: false,
                        autoComplete: 'tel',
                        id: 'telefono',
                        className: `w-full pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${telefonoError ? 'border-red-500' : 'border-gray-300'
                            }`
                    }}
                    inputStyle={{
                        paddingLeft: 48,
                        width: '100%',
                        borderRadius: '0.5rem',
                        height: 44
                    }}
                    buttonStyle={{
                        border: 'none',
                        background: 'transparent',
                        margin: 0,
                        padding: 0,
                        left: 2,
                        top: 2,
                        height: 38,
                        position: 'absolute'
                    }}
                    specialLabel=""
                    placeholder="Ej: +54 (11) 2345 6789"
                    enableSearch
                    masks={{ ar: '(..) ....-....' }}
                />

                {telefonoError && (
                    <span className="text-xs text-red-500 mt-1">Formato internacional requerido. Ejemplo: +54 11 2345 6789</span>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md mt-2"
                disabled={loading}
                style={loading ? { opacity: 0.6, pointerEvents: 'none' } : {}}
            >
                <FaUserPlus /> {loading ? 'Registrando...' : 'Registrarse'}
            </button>
        </form>
    );
}