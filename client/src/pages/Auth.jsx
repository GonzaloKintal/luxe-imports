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
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '', telefono: '' });
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
  const [registerTouched, setRegisterTouched] = useState({ firstName: false, lastName: false, email: false, password: false, telefono: false });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(5).fill(''));

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/products', { replace: true });
    }
  }, [user, navigate]);

  // Handlers de login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginBlur = (field) => {
    setLoginTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleRegisterBlur = (field) => {
    setRegisterTouched(prev => ({ ...prev, [field]: true }));
  };

  // ---- LOGIN ----
  async function handleLogin(e) {
  e.preventDefault();
  setLoginTouched({ email: true, password: true });
  if (!loginForm.email || !loginForm.password) return;
  setLoginLoading(true);

  try {
    const payload = {
      email: loginForm.email.trim().toLowerCase(),
      password: loginForm.password.trim(),
    };

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

    localStorage.setItem('token', data.token);

    try {
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser(payload);
    } catch {
      setUser(null);
    }

    toast.success('Sesión iniciada', {
      autoClose: 1000,
      onClose: () => {
        setLoginLoading(false);
        navigate('/');
      },
    });

  } catch (err) {
    toast.error(err.message, { autoClose: 3500 });
    setLoginLoading(false);
  }
}

  // ---- REGISTER ----
  async function handleRegister(e) {
    e.preventDefault();
    setRegisterTouched({ firstName: true, lastName: true, email: true, password: true, telefono: true });
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) return;
    setRegisterLoading(true);
    try {
	const payload = {
	  ...registerForm,
	  email: registerForm.email.trim(),
	  telefono: registerForm.telefono ? registerForm.telefono.trim() : '',
	};

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
console.log(res.status, data);
      
      if (!res.ok) throw new Error(data.error || 'Error al registrarse');


	// Limpiar inputs del código antes de abrir modal
	setVerificationCode(Array(5).fill(''));
	setShowVerificationModal(true);
	toast.info('Te enviamos un código de verificación al correo');

      toast.info('Te enviamos un código de verificación al correo');
    } catch (err) {
      toast.error(err.message);
      setRegisterLoading(false);
    }
  }

  // ---- VERIFICAR CÓDIGO ----
  async function handleVerifyCode() {
    const code = verificationCode.join('');
    if (code.length !== 5) {
      toast.error('Completa los 5 dígitos');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerForm.email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código incorrecto');

      toast.success('Registro verificado con éxito', {
        autoClose: 1500,
        onClose: () => {
          setRegisterForm({ firstName: '', lastName: '', email: '', password: '', telefono: '' });
          setRegisterTouched({ firstName: false, lastName: false, email: false, password: false, telefono: false });
          setTab('login');
          setRegisterLoading(false);
          setShowVerificationModal(false);
        }
      });

    } catch (err) {
      toast.error(err.message);
    }
  }

  const handleCancelVerification = () => {
    setShowVerificationModal(false);
    setRegisterLoading(false);
  };

  // Handler para inputs del código
  const handleCodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // auto-focus siguiente input
      if (value && index < 4) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:py-16">
      {/* Fondo animado */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/5 rounded-full blur-xl animate-pulse-slower" />
      </div>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />

      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative z-10 mt-8">
        {/* Header */}
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
            className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${tab === "login"
              ? "bg-gray-800 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setTab("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${tab === "register"
              ? "bg-gray-800 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setTab("register")}
          >
            Registrarse
          </button>
        </div>

        {/* Forms */}
        <div className="relative">
          {tab === "login" && (
            <LoginForm
              formData={loginForm}
              onFormChange={handleLoginChange}
              touchedFields={loginTouched}
              onBlurField={handleLoginBlur}
              onSubmit={handleLogin}
              loading={loginLoading}
            />
          )}
          {tab === "register" && (
            <RegisterForm
              formData={registerForm}
              onFormChange={handleRegisterChange}
              touchedFields={registerTouched}
              onBlurField={handleRegisterBlur}
              onSubmit={handleRegister}
              loading={registerLoading}
            />
          )}
        </div>
      </div>

      {/* Modal Verificación */}
      {showVerificationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Verificación de Email
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Te hemos enviado un código de 5 dígitos a tu correo. Ingrésalo a continuación.
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleCancelVerification}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyCode}
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
