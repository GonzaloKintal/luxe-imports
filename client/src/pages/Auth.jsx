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
            setRegisterTouched({ firstName: false, lastName: false, email: false, password: false, telefono: false });
            setTab('login');
        } catch (err) {
            toast.error(err.message);
        }
    }

return (
  <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:py-16">
    {/* Luces sutiles de fondo */}
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/5 rounded-full blur-xl animate-pulse-slower" />
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

    <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative z-10 mt-8">
      {/* Header con logo y bienvenida */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-3">
          <FaStore className="text-xl text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1 text-center">
          Bienvenido a Luxe Imports
        </h2>
        <p className="text-gray-500 text-sm text-center">
          Inicia sesión o crea tu cuenta para comenzar
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 rounded-md overflow-hidden border border-gray-100 bg-gray-50 p-1">
        <button
          className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${
            tab === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setTab("login")}
        >
          Iniciar sesión
        </button>
        <button
          className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${
            tab === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setTab("register")}
        >
          Registrarse
        </button>
      </div>

      {/* Formularios */}
      <div className="relative">
        {/* Formulario de Login */}
        {tab === "login" && (
          <div className="transition-all duration-300 ease-in-out opacity-100 translate-x-0">
            {/* Elemento decorativo minimalista con animación giratoria */}
            <div className="w-full flex justify-center mb-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Borde circular giratorio en blanco y negro */}
                <div className="absolute inset-0 rounded-full rotating-circle"></div>

                {/* Imagen fija */}
                <img
                  src="/assets/luxe-ico.svg"
                  alt="Luxe Icon"
                  className="w-40 h-40 object-contain"
                />
              </div>

              {/* Animación y estilo dentro del mismo archivo */}
              <style jsx>{`
                .rotating-circle {
                  border-radius: 50%;
                  border: 6px solid transparent;
                  border-top: 6px solid #000000;
                  border-right: 6px solid #ffffff;
                  border-bottom: 6px solid #000000;
                  border-left: 6px solid #ffffff;
                  animation: slowSpin 5s linear infinite;
                }

                @keyframes slowSpin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>

            <LoginForm
              formData={loginForm}
              onFormChange={handleLoginChange}
              touchedFields={loginTouched}
              onBlurField={handleLoginBlur}
              onSubmit={handleLogin}
            />
          </div>
        )}

        {/* Formulario de Registro */}
        {tab === "register" && (
          <div className="transition-all duration-300 ease-in-out opacity-100 translate-x-0">
            <RegisterForm
              formData={registerForm}
              onFormChange={handleRegisterChange}
              touchedFields={registerTouched}
              onBlurField={handleRegisterBlur}
              onSubmit={handleRegister}
            />
          </div>
        )}
      </div>
    </div>

    <style>{`
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
      }
      @keyframes pulse-slower {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      .animate-pulse-slow {
        animation: pulse-slow 8s ease-in-out infinite;
      }
      .animate-pulse-slower {
        animation: pulse-slower 12s ease-in-out infinite;
      }
    `}</style>
  </main>
);

}