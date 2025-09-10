import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaUserShield, FaHistory, FaEye, FaEyeSlash, FaChevronDown, FaList, FaFilter, FaSearch, FaListAlt, FaCheckCircle, FaBan, FaShieldAlt } from 'react-icons/fa';
import ConfirmModal from '../components/ConfirmModal';
import EditProductModal from '../components/EditProductModal';
import CreateProductModal from '../components/CreateProductModal';
import CreateAdminModal from '../components/CreateAdminModal';
import HistoryModal from '../components/HistoryModal';

export default function AdminPanel() {
    // Referencias para los detalles
    const adminDetailsRef = React.useRef(null);
    const productsDetailsRef = React.useRef(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showActivos, setShowActivos] = useState(true);
    const [search, setSearch] = useState("");
    const [showList, setShowList] = useState(true);
    const [stockFilter, setStockFilter] = useState('todos'); // 'todos', 'conStock', 'sinStock'
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleShowHistory() {
        setShowHistory(true);
        setLoadingHistory(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/carts/paid`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al obtener historial');
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error(err.message || 'Error al obtener historial');
        } finally {
            setLoadingHistory(false);
        }
    }

    async function handleCreateAdmin(form) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/create-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...form, role: 'admin' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear admin');
            toast.success('Admin creado correctamente');
            setShowCreateAdmin(false);
        } catch (err) {
            toast.error(err.message || 'Error al crear admin');
        }
    }

    useEffect(() => {
        // Obtener usuario desde el token (ejemplo simple)
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }
        // Decodificar el token para obtener el rol (puedes usar jwt-decode)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload);
            if (payload.role !== 'admin') {
                navigate('/');
            }
        } catch {
            navigate('/auth');
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/products/`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    function handleDelete(id) {
        setDeleteId(id);
        setShowConfirm(true);
    }

    async function confirmDelete() {
        try {
            const token = localStorage.getItem('token');
            // Cambia el estado a inactivo y el stock a 0
            const res = await fetch(`${API_URL}/api/products/${deleteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: false, stock: 0 }),
            });
            if (!res.ok) throw new Error('Error al eliminar');
            setProducts(products.map(p => (p._id === deleteId || p.id === deleteId) ? { ...p, status: false, stock: 0 } : p));
        } catch {
            alert('No se pudo eliminar el producto');
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    }

    async function handleReactivate(id) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: true }),
            });
            if (!res.ok) throw new Error('Error al reactivar');
            setProducts(products.map(p => (p._id === id || p.id === id) ? { ...p, status: true } : p));
            toast.success('Producto reactivado');
        } catch {
            toast.error('No se pudo reactivar el producto');
        }
    }

    function handleEdit(product) {
        setEditProduct(product);
        setShowEdit(true);
    }

    async function saveEdit(form) {
        try {
            // Mostrar datos recibidos
            console.log('AdminPanel: saveEdit form:', form);
            const token = localStorage.getItem('token');
            // Usar id recibido del modal
            const productId = form.id;
            console.log('AdminPanel: saveEdit productId:', productId);
            console.log('AdminPanel: saveEdit body:', form.body);
            const res = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form.body),
            });
            if (!res.ok) throw new Error('Error al editar producto');
            const updated = await res.json();
            setProducts(products.map(p => (p._id === productId || p.id === productId) ? updated : p));
            setShowEdit(false);
            setEditProduct(null);
        } catch (err) {
            console.error('AdminPanel: saveEdit error:', err);
            alert('No se pudo editar el producto');
        }
    }

    async function saveCreate(form) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Error al crear producto');
            const created = await res.json();
            setProducts([...products, created]);
            setShowCreate(false);
        } catch {
            alert('No se pudo crear el producto');
        }
    }

    if (loading) return <div className="p-6 text-center">Cargando...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

return (
    <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden min-h-screen w-full">
        <ToastContainer 
            position="top-right" 
            autoClose={2500}
            theme="light"
        />
        
        <div className="flex items-center flex-col relative z-10 px-6 py-20">
            <h1 className="text-4xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                Panel de Administración
            </h1>
            
            {/* Menú desplegable de acciones admin */}
            <div className="mb-8 flex flex-col items-start relative w-full max-w-4xl">
                <details className="w-full" ref={adminDetailsRef} onToggle={e => setAdminOpen(adminDetailsRef.current?.open)}>
                    <summary className="cursor-pointer px-6 py-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 select-none">
                        <span className="flex items-center gap-3">
                            <FaShieldAlt className="text-xl text-gray-600" /> Acciones de administrador
                        </span>
                        <FaChevronDown className={`text-xl opacity-70 ml-2 transition-transform duration-300 ${adminOpen ? 'rotate-180' : ''}`} />
                    </summary>
                    <div className="flex flex-col gap-3 mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-300">
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-sm transition-all duration-300"
                        >
                            <FaPlus className="text-xl" /> Crear producto
                        </button>
                        <button
                            onClick={() => setShowCreateAdmin(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-sm transition-all duration-300"
                        >
                            <FaUserShield className="text-xl" /> Crear admin
                        </button>
                        <button
                            onClick={handleShowHistory}
                            className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-sm transition-all duration-300"
                        >
                            <FaHistory className="text-xl" /> Ver historial de compras
                        </button>
                    </div>
                </details>
                
                {/* Menú de productos con filtro y selector activos/inactivos */}
                {products.length > 0 && (
                    <details className="w-full mt-6" ref={productsDetailsRef} onToggle={e => setProductsOpen(productsDetailsRef.current?.open)}>
                        <summary className="cursor-pointer px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-900 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 select-none">
                            <span className="flex items-center gap-3">
                                <FaList className="text-xl text-gray-600" /> Administrar productos
                            </span>
                            <FaChevronDown className={`text-xl opacity-70 ml-2 transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="flex flex-col gap-4 mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-300">
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FaFilter className="text-gray-600 text-lg" />
                                    <select
                                        value={showActivos ? 'activos' : 'inactivos'}
                                        onChange={e => setShowActivos(e.target.value === 'activos')}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
                                    >
                                        <option value="activos">Activos</option>
                                        <option value="inactivos">Inactivos</option>
                                    </select>
                                    {showActivos ? 
                                        <FaCheckCircle className="text-green-600 ml-1" /> : 
                                        <FaBan className="text-red-600 ml-1" />
                                    }
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-64">
                                    <FaSearch className="text-gray-600 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-700">Stock:</span>
                                    <select
                                        value={stockFilter}
                                        onChange={e => setStockFilter(e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="conStock">Con stock</option>
                                        <option value="sinStock">Sin stock</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaListAlt className="text-gray-600 text-lg" />
                                    <button
                                        onClick={() => setShowList(v => !v)}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium border border-gray-300 bg-gray-100 text-gray-900 text-sm transition-all duration-300 ${showList ? 'opacity-100' : 'opacity-60'}`}
                                    >
                                        {showList ? <FaEyeSlash className="text-gray-600" /> : <FaEye className="text-gray-600" />}
                                        {showList ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </details>
                )}
            </div>
            
            {/* Listado de productos filtrados */}
            {showList && productsOpen && (
                <ul className="space-y-4 w-full max-w-4xl">
                    {products
                        .filter(p => showActivos ? p.status : !p.status)
                        .filter(p => {
                            if (stockFilter === 'conStock') return p.stock > 0;
                            if (stockFilter === 'sinStock') return p.stock === 0;
                            return true;
                        })
                        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
                        .map((p) => (
                            <li key={p._id || p.id} className="bg-white p-4 rounded-xl border border-gray-300 shadow-md flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
                                <img
                                    src={p.thumbnails?.[0] || 'https://placehold.co/100x100'}
                                    alt={p.title}
                                    className="w-16 h-16 object-cover rounded-md shadow-md flex-shrink-0 bg-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-lg text-gray-900 truncate">{p.title}</h2>
                                    <p className="text-gray-700">${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-gray-800 hover:bg-gray-900 text-white border border-gray-800 px-4 py-2 rounded-lg transition-all duration-300"
                                        style={{ display: p.status ? 'inline-block' : 'none' }}
                                    >
                                        Editar
                                    </button>
                                    {p.status ? (
                                        <button
                                            onClick={() => handleDelete(p._id || p.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white border border-red-600 px-4 py-2 rounded-lg transition-all duration-300"
                                        >
                                            Eliminar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleReactivate(p._id || p.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white border border-green-600 px-4 py-2 rounded-lg transition-all duration-300"
                                        >
                                            Reactivar
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                </ul>
            )}

            <CreateAdminModal
                open={showCreateAdmin}
                onSave={handleCreateAdmin}
                onCancel={() => setShowCreateAdmin(false)}
            />

            {/* Modal para historial de compras */}
            <HistoryModal
                open={showHistory}
                loading={loadingHistory}
                history={history}
                onClose={() => setShowHistory(false)}
            />

            <CreateProductModal
                open={showCreate}
                onSave={saveCreate}
                onCancel={() => setShowCreate(false)}
            />
            <EditProductModal
                open={showEdit}
                product={editProduct}
                onSave={saveEdit}
                onCancel={() => { setShowEdit(false); setEditProduct(null); }}
            />
            <ConfirmModal
                open={showConfirm}
                title="Confirmar eliminación"
                message="¿Seguro que quieres eliminar este producto?"
                onConfirm={confirmDelete}
                onCancel={() => { setShowConfirm(false); setDeleteId(null); }}
            />
        </div>
    </main>
);
}