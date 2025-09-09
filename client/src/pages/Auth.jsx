import { useState, useContext, useEffect } from 'react';
import { FaStore } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/UserContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function Auth() {
    const [tab, setTab] = useState('login');
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
    const [registerTouched, setRegisterTouched] = useState({ firstName: false, lastName: false, email: false, password: false });
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const API_URL = import.meta.env.VITE_API_URL;

    // Si ya está logueado, redirigir a home
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Handlers para cambios en formularios
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));
    };

    // Handlers para blur
    const handleLoginBlur = (field) => {
        setLoginTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleRegisterBlur = (field) => {
        setRegisterTouched(prev => ({ ...prev, [field]: true }));
    };

    async function handleLogin(e) {
        e.preventDefault();
        setLoginTouched({ email: true, password: true });
        if (!loginForm.email || !loginForm.password) return;
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                setUser(payload);
            } catch {
                setUser(null);
            }
            toast.success('Sesión iniciada');
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setRegisterTouched({ firstName: true, lastName: true, email: true, password: true });
        if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) return;
        try {
            const payload = {
                ...registerForm,
                telefono: registerForm.telefono ? registerForm.telefono.trim() : '',
            };
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al registrarse');
            toast.success('Registro exitoso, ahora puedes iniciar sesión');
            setRegisterForm({ firstName: '', lastName: '', email: '', password: '', telefono: '' });
            setTab('login');
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 md:py-16">
            {/* Luces suaves flotantes */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-float2" />
            </div>

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

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-fadeInDown relative z-10 mt-8 min-h-[750px]">
                {/* Header con logo y bienvenida */}
                <div className="flex flex-col items-center mb-6">
                    <FaStore className="text-4xl text-black mb-2" />
                    <h2 className="text-xl font-bold text-black mb-1 text-center">Bienvenido a Luxe Imports</h2>
                    <p className="text-gray-600 text-sm text-center">
                        Inicia sesión o crea tu cuenta para comenzar a comprar
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
                    <button
                        className={`flex-1 py-3 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            tab === 'login'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setTab('login')}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        className={`flex-1 py-3 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            tab === 'register'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setTab('register')}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Formularios */}
                <div className="relative min-h-[320px] md:min-h-[380px]">
                    {/* Formulario de Login */}
                    <div
                        key={tab}
                        className={`absolute inset-0 transition-all duration-400 ease-in-out ${
                            tab === 'login' 
                                ? 'opacity-100 translate-x-0 z-10' 
                                : 'opacity-0 -translate-x-4 pointer-events-none z-0'
                        }`}
                    >
                        <LoginForm
                            formData={loginForm}
                            onFormChange={handleLoginChange}
                            touchedFields={loginTouched}
                            onBlurField={handleLoginBlur}
                            onSubmit={handleLogin}
                        />
                    </div>

                    {/* Formulario de Registro */}
                    <div
                        key={tab + '-register'}
                        className={`absolute inset-0 transition-all duration-400 ease-in-out ${
                            tab === 'register' 
                                ? 'opacity-100 translate-x-0 z-10' 
                                : 'opacity-0 translate-x-4 pointer-events-none z-0'
                        }`}
                    >
                        <RegisterForm
                            formData={registerForm}
                            onFormChange={handleRegisterChange}
                            touchedFields={registerTouched}
                            onBlurField={handleRegisterBlur}
                            onSubmit={handleRegister}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                .animate-fadeInDown { 
                    animation: fadeInDown 0.7s cubic-bezier(.39,.575,.565,1) both; 
                }
                @keyframes fadeInDown { 
                    0% { opacity: 0; transform: translateY(-20px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                @keyframes float { 
                    0% { transform: translateY(0); } 
                    50% { transform: translateY(-15px); } 
                    100% { transform: translateY(0); } 
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes float2 { 
                    0% { transform: translateY(0); } 
                    50% { transform: translateY(20px); } 
                    100% { transform: translateY(0); } 
                }
                .animate-float2 { animation: float2 8s ease-in-out infinite; }
            `}</style>
        </main>
    );
}