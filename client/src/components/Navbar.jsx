// import { useState, useEffect, useContext } from 'react';
// import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserShield, FaUser } from 'react-icons/fa';
// import { Link, useLocation } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';

// function Navbar() {
//     const { user, setUser } = useContext(UserContext);
//     const [isOpen, setIsOpen] = useState(false);
//     const [profileOpen, setProfileOpen] = useState(false);
//     const location = useLocation();

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 const payload = JSON.parse(atob(token.split('.')[1]));
//                 setUser(payload);
//             } catch {
//                 setUser(null);
//             }
//         } else {
//             setUser(null);
//         }
//     }, []);

//     // Helper to check if a path is active
//     const isActive = (path) => {
//         if (path === '/') {
//             return location.pathname === '/';
//         }
//         return location.pathname.startsWith(path);
//     };

//     return (
//         <nav className="bg-white border-gray-200 dark:bg-gray-900">
//             <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//                 <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
//                     <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
//                     <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
//                         TuTienda
//                     </span>
//                 </Link>

//                 <button
//                     onClick={() => setIsOpen(!isOpen)}
//                     type="button"
//                     className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//                     aria-controls="navbar-default"
//                     aria-expanded={isOpen}
//                     aria-label="Toggle menu"
//                 >
//                     <span className="sr-only">Open main menu</span>
//                     <svg
//                         className="w-5 h-5"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 17 14"
//                     >
//                         <path
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M1 1h15M1 7h15M1 13h15"
//                         />
//                     </svg>
//                 </button>

//                 <div
//                     className={`w-full md:block md:w-auto ${isOpen ? 'block' : 'hidden'}`}
//                     id="navbar-default"
//                 >
//                     <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//                         <li>
//                             <Link
//                                 to="/"
//                                 className={`block py-2 px-3 rounded-sm md:p-0 ${isActive('/') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}
//                                 aria-current={isActive('/') ? 'page' : undefined}
//                                 onClick={() => setIsOpen(false)}
//                             >
//                                 Home
//                             </Link>
//                         </li>
//                         <li>
//                             <Link
//                                 to="/products"
//                                 className={`block py-2 px-3 rounded-sm md:p-0 ${isActive('/products') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}
//                                 aria-current={isActive('/products') ? 'page' : undefined}
//                                 onClick={() => setIsOpen(false)}
//                             >
//                                 Products
//                             </Link>
//                         </li>
//                         {!user && (
//                             <li>
//                                 <Link
//                                     to="/auth"
//                                     className={`block py-2 px-3 rounded-sm md:p-0 ${isActive('/auth') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}
//                                     onClick={() => setIsOpen(false)}
//                                 >
//                                     Acceder
//                                 </Link>
//                             </li>
//                         )}
//                         {user && (
//                             <>
//                                 {user.role === 'admin' ? (
//                                     <li>
//                                         <Link
//                                             to="/admin"
//                                             className={`block py-2 px-3 rounded-sm md:p-0 ${isActive('/admin') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}
//                                             onClick={() => setIsOpen(false)}
//                                         >
//                                             Admin
//                                         </Link>
//                                     </li>
//                                 ) : (
//                                     <li>
//                                         <Link
//                                             to="/cart"
//                                             className={`block py-2 px-3 rounded-sm md:p-0 ${isActive('/cart') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}
//                                             onClick={() => setIsOpen(false)}
//                                         >
//                                             Cart
//                                         </Link>
//                                     </li>
//                                 )}
//                                 <li className="relative">
//                                     <button
//                                         className="flex items-center gap-2 py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent font-semibold"
//                                         onClick={() => setProfileOpen((open) => !open)}
//                                     >
//                                         <span className="hidden sm:inline">Perfil</span>
//                                         <FaChevronDown className={`ml-1 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
//                                     </button>
//                                     {profileOpen && (
//                                         <div>
//                                             <div
//                                                 className="fixed inset-0 z-40"
//                                                 onClick={() => setProfileOpen(false)}
//                                             />
//                                             <div
//                                                 className="absolute right-0 mt-2 w-72 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 z-50 flex flex-col items-center animate-fadeInDown backdrop-blur-md"
//                                                 onClick={e => e.stopPropagation()}
//                                             >
//                                                 <div className="mb-2 flex flex-col items-center">
//                                                     <FaUserCircle className="text-6xl text-blue-400 dark:text-blue-200 mb-2" />
//                                                     <div className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300 mb-2">
//                                                         {user.role === 'admin' ? <FaUserShield className="text-base" /> : <FaUser className="text-base" />}
//                                                         <span className="font-semibold">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
//                                                     </div>
//                                                 </div>
//                                                 {user.name && (
//                                                     <div className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 text-center">{user.name}</div>
//                                                 )}
//                                                 <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 text-center">{user.email}</div>
//                                                 <button
//                                                     onClick={() => {
//                                                         localStorage.removeItem('token');
//                                                         window.location.reload();
//                                                     }}
//                                                     className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition shadow-sm group"
//                                                 >
//                                                     <FaSignOutAlt className="text-lg group-hover:scale-105 transition-transform duration-200" />
//                                                     <span className="group-hover:underline">Cerrar sesión</span>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </li>
//                             </>
//                         )}
//                     </ul>

//                 </div>
//             </div>
//         </nav>
//     );
// }

// export default Navbar;



import { useState, useEffect, useContext } from 'react';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserShield, FaUser } from 'react-icons/fa';
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
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-xl py-3' : 'bg-black/80 backdrop-blur-sm py-4'}`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter relative group">
                        <span className="text-white">LUXE</span>
                        <span className="text-gray-400">IMPORTS</span>
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
                            Home
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>

                        <Link
                            to="/products"
                            className={`relative group transition-all duration-300 ${isActive('/products') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Products
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>

                        {!user && (
                            <Link
                                to="/auth"
                                className={`relative group transition-all duration-300 ${isActive('/auth') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                Acceder
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
                                        Cart
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
                                                className="absolute right-0 mt-2 w-72 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-800 p-6 z-50 flex flex-col items-center"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div className="mb-2 flex flex-col items-center">
                                                    <FaUserCircle className="text-6xl text-white mb-2" />
                                                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                                        {user.role === 'admin' ? <FaUserShield className="text-base" /> : <FaUser className="text-base" />}
                                                        <span className="font-semibold">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                                                    </div>
                                                </div>
                                                {user.name && (
                                                    <div className="text-base font-bold text-white mb-1 text-center">{user.name}</div>
                                                )}
                                                <div className="text-sm font-semibold text-gray-300 mb-1 text-center">{user.email}</div>
                                                <button
                                                    onClick={() => {
                                                        localStorage.removeItem('token');
                                                        window.location.reload();
                                                    }}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-900/50 backdrop-blur-sm text-red-300 font-semibold hover:bg-red-800/70 transition-all duration-300 shadow-sm group border border-red-800/50"
                                                >
                                                    <FaSignOutAlt className="text-lg group-hover:scale-105 transition-transform duration-200" />
                                                    <span className="group-hover:underline">Cerrar sesión</span>
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
                                className={`block py-3 transition-all duration-300 transform hover:translate-x-2 ${isActive('/auth') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                Acceder
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
                                        Cart
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