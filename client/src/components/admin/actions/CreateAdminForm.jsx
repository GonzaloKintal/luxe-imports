import { useState, useEffect } from 'react';
import { FaUserShield, FaTimes } from 'react-icons/fa';

export default function CreateAdminForm({ onSave, onCancel }) {

    const initialForm = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };
    const [form, setForm] = useState(initialForm);

    // Limpiar formulario al cerrar
    useEffect(() => {
        setForm(initialForm);
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
        setForm(initialForm);
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaUserShield className="text-gray-600" />
                    Crear nuevo admin
                </h3>
                <button
                    onClick={onCancel}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                    title="Cerrar formulario"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-sm">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Nombre del administrador"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-sm">
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Apellido del administrador"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">
                        Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Contraseña segura"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => {
                            setForm(initialForm);
                            onCancel();
                        }}
                        className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 text-sm shadow-md"
                    >
                        Crear admin
                    </button>
                </div>
            </form>
        </div>
    );
    
}