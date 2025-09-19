import { useState, useEffect, useContext } from 'react';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserShield, FaUser, FaSignInAlt, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.clear();
        setUser(null);
        setProfileOpen(false);

        // Navegamos rápidamente
        setTimeout(() => {
            navigate('/auth');
        }, 100);
    };


    return (
        <>
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
                                            className={`relative group transition-all duration-300 flex items-center gap-2 ${isActive('/cart') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <FaShoppingCart className="text-lg" />
                                            <span className="sr-only">Carrito</span>
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
                                                    {(user.firstName || user.lastName) && (
                                                        <div className="text-base font-bold text-gray-900 mb-1 text-center">
                                                            {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-semibold text-gray-900 mb-1 text-center">{user.email}</div>
                                                    <button
                                                        onClick={handleLogout}
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
                    <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <div className="py-4 border-t border-gray-700 flex flex-col justify-center items-center">
                            <Link
                                to="/"
                                className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                to="/products"
                                className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/products') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                Productos
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
                                            className={`block py-3 transition-all duration-300 transform hover:translate-x-2 items-center gap-2 ${isActive('/cart') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <FaShoppingCart className="text-xl" />
                                            <span className="sr-only">Carrito</span>
                                        </Link>
                                    )}

                                    <div className="pt-3 relative">
                                        <button
                                            className="w-full flex justify-center items-center gap-2 text-gray-200 hover:text-white transition-all duration-300 font-semibold"
                                            onClick={() => setProfileOpen(!profileOpen)}
                                        >
                                            Perfil
                                            <FaChevronDown
                                                className={`ml-1 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {profileOpen && (
                                            <div className="mt-2 relative z-20 flex flex-col gap-3 p-4 w-60 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 text-black">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                        {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                                        <span>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                                                    </div>
                                                </div>

                                                {(user.firstName || user.lastName) && (
                                                    <div className="text-center text-base font-bold text-gray-900">{[user.firstName, user.lastName].filter(Boolean).join(' ')}</div>
                                                )}

                                                <div className="text-center text-sm text-gray-800">{user.email}</div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 shadow-sm border border-red-200"
                                                >
                                                    <FaSignOutAlt className="text-lg group-hover:scale-105 transition-transform duration-200" />
                                                    <span className="cursor-pointer group-hover:underline">Cerrar sesión</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default Navbar;