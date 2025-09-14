import { useState, useEffect } from 'react';
import { FaUserShield, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import ConfirmDeleteAdmin from './ConfirmDeleteAdmin.jsx';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateAdminForm({ onSave, onCancel }) {

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
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/admins`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                toast.error(`Error al obtener admins (${res.status})`);
                return;
            }
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            toast.error('Error de red o inesperado: ' + err.message);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
        setForm(initialForm);
        fetchAdmins();
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
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/admins/${deleteModal.admin._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Error al eliminar admin');
            toast.success('Admin eliminado');
            fetchAdmins();
        } catch (err) {
            toast.error(err.message);
        }
        closeDeleteModal();
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
                                    <div>
                                        <span className="font-bold text-gray-800">{admin.firstName} {admin.lastName}</span>
                                        <span className="ml-2 text-gray-500 text-sm">{admin.email}</span>
                                        {isSelf && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">(Tú)</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => !isSelf && openDeleteModal(admin)}
                                            className={`p-2 rounded-lg ${isSelf ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                                            title={isSelf ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                                            disabled={isSelf}
                                        >
                                            <FaTrash />
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