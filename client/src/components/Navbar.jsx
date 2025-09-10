

import { useState, useEffect, useContext } from 'react';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserShield, FaUser, FaSignInAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to check if a path is active
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-xl py-3' : 'bg-black/95 backdrop-blur-sm py-4'}`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter relative group">
                        <span className="luxe-font text-white">LUXE</span>
                        <span className="luxe-font text-gray-400">IMPORTS</span>
                        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer"></div>
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden focus:outline-none relative w-6 h-6"
                        aria-controls="navbar-default"
                        aria-expanded={isOpen}
                        aria-label="Toggle menu"
                    >
                        <div className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></div>
                        <div className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                        <div className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></div>
                    </button>

                    <div className="hidden md:flex items-center space-x-10">
                        <Link
                            to="/"
                            className={`relative group transition-all duration-300 ${isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>

                        <Link
                            to="/products"
                            className={`relative group transition-all duration-300 ${isActive('/products') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Productos
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>

                        {!user && (
                            <Link
                                to="/auth"
                                className={`relative group transition-all duration-300 flex items-center gap-2 ${isActive('/auth') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <FaSignInAlt className="text-sm" />
                                Ingresar
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/auth') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        )}

                        {user && (
                            <>
                                {user.role === 'admin' ? (
                                    <Link
                                        to="/admin"
                                        className={`relative group transition-all duration-300 ${isActive('/admin') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin
                                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/admin') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/cart"
                                        className={`relative group transition-all duration-300 ${isActive('/cart') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Carrito
                                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/cart') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </Link>
                                )}

                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold"
                                        onClick={() => setProfileOpen((open) => !open)}
                                    >
                                        <span className="hidden sm:inline">Perfil</span>
                                        <FaChevronDown className={`ml-1 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {profileOpen && (
                                        <div>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setProfileOpen(false)}
                                            />
                                            <div
                                                className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-300 p-6 z-50 flex flex-col items-center text-black"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div className="mb-2 flex flex-col items-center">
                                                    <FaUserCircle className="text-6xl text-gray-900 mb-2" />
                                                    <div className="flex items-center gap-2 text-sm text-gray-900 mb-2">
                                                        {user.role === 'admin' ? <FaUserShield className="text-base" /> : <FaUser className="text-base" />}
                                                        <span className="font-semibold">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                                                    </div>
                                                </div>
                                                {user.name && (
                                                    <div className="text-base font-bold text-gray-900 mb-1 text-center">{user.name}</div>
                                                )}
                                                <div className="text-sm font-semibold text-gray-900 mb-1 text-center">{user.email}</div>
                                                <button
                                                    onClick={() => {
                                                        localStorage.removeItem('token');
                                                        window.location.reload();
                                                    }}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 shadow-sm border border-red-200"
                                                >
                                                    <FaSignOutAlt className="text-lg group-hover:scale-105 transition-transform duration-200" />
                                                    <span className="cursor-pointer group-hover:underline">Cerrar sesión</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="py-4 border-t border-gray-700">
                        <Link
                            to="/"
                            className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/products') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Products
                        </Link>
                        {!user && (
                            <Link
                                to="/auth"
                                className={`py-3 transition-all duration-300 transform hover:translate-x-2 flex items-center gap-2 ${isActive('/auth') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <FaSignInAlt className="text-sm" />
                                Ingresar
                            </Link>
                        )}
                        {user && (
                            <>
                                {user.role === 'admin' ? (
                                    <Link
                                        to="/admin"
                                        className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/admin') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                ) : (
                                    <Link
                                        to="/cart"
                                        className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/cart') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Carrito
                                    </Link>
                                )}
                                <div className="py-3">
                                    <button
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold transform hover:translate-x-2"
                                        onClick={() => setProfileOpen((open) => !open)}
                                    >
                                        Perfil
                                        <FaChevronDown className={`ml-1 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;