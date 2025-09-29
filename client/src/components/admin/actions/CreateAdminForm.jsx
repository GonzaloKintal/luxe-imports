import { useState, useEffect } from 'react';
import { FaUserShield, FaTimes, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import ConfirmDeleteAdmin from './ConfirmDeleteAdmin.jsx';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateAdminForm({ onSave }) {
    const { authFetch } = useAuthFetch(); // <- obtenemos la función
    const [isUploading, setIsUploading] = useState(false);

    const initialForm = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };
    const [form, setForm] = useState(initialForm);
    const [admins, setAdmins] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, admin: null });

    useEffect(() => {
        setForm(initialForm);
        fetchAdmins();
        // Obtener el id del usuario actual del token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.id || payload._id);
            } catch {
                setCurrentUserId(null);
            }
        }
    }, []);

    async function fetchAdmins() {
        try {
            const res = await authFetch(`${API_URL}/api/admin/admins`); // <- usamos authFetch
            if (!res.ok) throw new Error(`Error al obtener admins (${res.status})`);
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            console.error('Error al obtener admins:', err);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsUploading(true);
        try {
            await onSave(form);
            setForm(initialForm);
            await fetchAdmins();
        } finally {
            setIsUploading(false);
        }
    }

    function openDeleteModal(admin) {
        setDeleteModal({ open: true, admin });
    }

    function closeDeleteModal() {
        setDeleteModal({ open: false, admin: null });
    }

    async function confirmDeleteAdmin() {
        if (!deleteModal.admin) return;
        try {
            const res = await authFetch(`${API_URL}/api/admin/admins/${deleteModal.admin._id}`, {
                method: 'DELETE'
            }); // <- authFetch se encarga del token y notificación
            if (!res.ok) throw new Error('Error al eliminar admin');
            await fetchAdmins();
        } catch (err) {
            console.error(err.message);
        }
        closeDeleteModal();
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaUserShield className="text-gray-600" />

                    <span className="sm:hidden">Crear admin</span>
                    <span className="hidden sm:inline">Crear nuevo admin</span>
                    
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-gray-700 mb-1 font-semibold text-sm">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            id='firstName'
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Nombre del administrador"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-gray-700 mb-1 font-semibold text-sm">
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            id='lastName'
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
                    <label htmlFor='email' className="block text-gray-700 mb-1 font-semibold text-sm">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        id='email'
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 mb-1 font-semibold text-sm">
                        Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
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
                        type="submit"
                        disabled={isUploading}
                        className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm shadow-md ${isUploading
                            ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            } flex items-center justify-center gap-2`}
                    >
                        {isUploading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 text-gray-500" />
                                Creando admin...
                            </>
                        ) : 'Crear admin'}
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FaEye className="text-gray-600" />
                    Administrar admins
                </h4>
                {admins.length === 0 ? (
                    <div className="text-gray-500 text-sm py-6 text-center">No hay admins creados.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {admins.map(admin => {
                            const isSelf = currentUserId === admin._id;
                            return (
                                <li key={admin._id} className="py-3 flex items-center justify-between">
                                    <div className='flex flex-col sm:flex-row'>
                                        <span className="font-bold text-gray-800">{admin.firstName} {admin.lastName}</span>
                                        <div className="flex flex-row items-center">
                                            <span className="sm:ml-2 text-gray-500 text-sm">{admin.email}</span>
                                            {isSelf && (
                                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">(Tú)</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => !isSelf && openDeleteModal(admin)}
                                            className={`p-2 rounded-lg ${isSelf ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-500/60 hover:bg-red-600 text-white transition-all duration-300 shadow-md flex items-center justify-center'}`}
                                            title={isSelf ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                                            disabled={isSelf}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            {/* Modal de confirmación de eliminación de admin */}
            <ConfirmDeleteAdmin
                open={deleteModal.open}
                adminName={deleteModal.admin ? `${deleteModal.admin.firstName} ${deleteModal.admin.lastName}` : ''}
                adminEmail={deleteModal.admin ? deleteModal.admin.email : ''}
                onConfirm={confirmDeleteAdmin}
                onCancel={closeDeleteModal}
            />
        </div>
    );
}