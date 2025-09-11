import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaChevronDown, FaList, FaFilter, FaSearch, FaListAlt, FaCheckCircle, FaBan } from 'react-icons/fa';
import EditProductModal from '../../components/EditProductModal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminProducts({ products, setProducts, API_URL }) {
    const productsDetailsRef = React.useRef(null);
    const [productsOpen, setProductsOpen] = useState(false);
    const [showActivos, setShowActivos] = useState(true);
    const [search, setSearch] = useState("");
    const [showList, setShowList] = useState(true);
    const [stockFilter, setStockFilter] = useState('todos');
    const [showEdit, setShowEdit] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    async function toggleFeatured(product) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ featured: !product.featured }),
            });
            if (!res.ok) throw new Error('Error al actualizar destacado');
            const updated = await res.json();
            setProducts(products.map(p => p._id === updated._id ? updated : p));
            toast.success(updated.featured ? 'Marcado como destacado' : 'Quitado de destacados');
        } catch {
            toast.error('No se pudo actualizar el estado de destacado');
        }
    }

    function handleDelete(id) {
        setDeleteId(id);
        setShowConfirm(true);
    }

    async function confirmDelete() {
        try {
            const token = localStorage.getItem('token');
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
            toast.success('Producto eliminado correctamente');
        } catch {
            toast.error('No se pudo eliminar el producto');
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
            console.log('AdminProducts: saveEdit form:', form);
            const token = localStorage.getItem('token');
            const productId = form.id;
            console.log('AdminProducts: saveEdit productId:', productId);
            console.log('AdminProducts: saveEdit body:', form.body);
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
            toast.success('Producto editado correctamente');
        } catch (err) {
            console.error('AdminProducts: saveEdit error:', err);
            toast.error('No se pudo editar el producto');
        }
    }

    const filteredProducts = products
        .filter(p => showActivos ? p.status : !p.status)
        .filter(p => {
            if (stockFilter === 'conStock') return p.stock > 0;
            if (stockFilter === 'sinStock') return p.stock === 0;
            return true;
        })
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-6">
            <details className="w-full" ref={productsDetailsRef} onToggle={e => setProductsOpen(productsDetailsRef.current?.open)}>
                <summary className="cursor-pointer px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-900 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 select-none">
                    <span className="flex items-center gap-3">
                        <FaList className="text-xl text-gray-600" /> Administrar productos ({filteredProducts.length})
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

            {/* Listado de productos filtrados */}
            {showList && productsOpen && (
                <ul className="space-y-4 w-full mt-4">
                    {filteredProducts.length === 0 ? (
                        <li className="bg-white p-8 rounded-xl border border-gray-300 shadow-md text-center">
                            <p className="text-gray-500 text-lg">No se encontraron productos con los filtros actuales</p>
                        </li>
                    ) : (
                        filteredProducts.map((p) => (
                            <li key={p._id || p.id} className="bg-white p-4 rounded-xl border border-gray-300 shadow-md flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
                                <img
                                    src={p.thumbnails?.[0] || 'https://placehold.co/100x100'}
                                    alt={p.title}
                                    className="w-16 h-16 object-cover rounded-md shadow-md flex-shrink-0 bg-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-lg text-gray-900 truncate">{p.title}</h2>
                                    <p className="text-gray-700">${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}</p>
                                    <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {p.status && (
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="bg-gray-800 hover:bg-gray-900 text-white border border-gray-800 px-4 py-2 rounded-lg transition-all duration-300"
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleFeatured(p)}
                                        className={`px-4 py-2 rounded-lg border transition-all duration-300 font-semibold flex items-center gap-2 ${p.featured ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                                        title={p.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                                    >
                                        {p.featured ? <FaCheckCircle className="text-yellow-500" /> : <FaBan className="text-gray-400" />}
                                        {p.featured ? 'Destacado' : 'No destacado'}
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
                        ))
                    )}
                </ul>
            )}

            {/* Modales */}
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
    );
}