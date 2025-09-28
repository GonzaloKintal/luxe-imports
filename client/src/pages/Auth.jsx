
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import VerificationModal from '../components/modals/VerificationModal';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';
import { useNotify } from '../components/common/ToastProvider';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '', telefono: '' });
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
  const [registerTouched, setRegisterTouched] = useState({ firstName: false, lastName: false, email: false, password: false, telefono: false });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const notify = useNotify();

  // -------- Handlers de login --------
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginBlur = (field) => setLoginTouched(prev => ({ ...prev, [field]: true }));
  const handleRegisterBlur = (field) => setRegisterTouched(prev => ({ ...prev, [field]: true }));

  async function handleLogin(e) {
    e.preventDefault();
    setLoginTouched({ email: true, password: true });
    if (!loginForm.email || !loginForm.password) return;
    setLoginLoading(true);

    try {
      const payload = { email: loginForm.email.trim().toLowerCase(), password: loginForm.password.trim() };
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

      notify.success('Sesión iniciada');
      setLoginLoading(false);
      navigate('/');

    } catch (err) {
      notify.error(err.message);
      setLoginLoading(false);
    }
  }

  // -------- Handlers de register --------
  async function handleRegister(e) {
    e.preventDefault();
    setRegisterTouched({ firstName: true, lastName: true, email: true, password: true, telefono: true });
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) return;
    setRegisterLoading(true);

    try {
      const payload = { ...registerForm, email: registerForm.email.trim().toLowerCase(), telefono: registerForm.telefono ? registerForm.telefono.trim() : '' };
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrarse');

      setShowVerificationModal(true);
      notify.info('Te enviamos un código de verificación al correo');

    } catch (err) {
      notify.error(err.message);
      setRegisterLoading(false);
    }
  }

  // -------- Verification Modal Handlers --------
  const handleVerifyCode = async (code) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerForm.email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código incorrecto');

      notify.success('Registro verificado con éxito');
      setRegisterForm({ firstName: '', lastName: '', email: '', password: '', telefono: '' });
      setRegisterTouched({ firstName: false, lastName: false, email: false, password: false, telefono: false });
      setTab('login');
      setRegisterLoading(false);
      setShowVerificationModal(false);

    } catch (err) {
      notify.error(err.message);
    }
  };

  const handleCancelVerification = () => {
    setShowVerificationModal(false);
    setRegisterLoading(false);
  };

  // -------- Forgot Password Handlers --------
  const handleSendForgotCode = async (email) => {
    if (!email) {
      notify.error("Ingresa tu email");
      return false;
    }
    setForgotLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar código");
      notify.success("Código enviado al correo");
      return true;
    } catch (err) {
      notify.error(err.message);
      return false;
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyForgotCode = async (email, code) => {
    if (code.length !== 5) {
      notify.error('Completa los 5 dígitos');
      return false;
    }
    setForgotLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código incorrecto');
      notify.success('Código verificado');
      return true;
    } catch (err) {
      notify.error(err.message);
      return false;
    } finally {
      setForgotLoading(false);
    }
  };

  const handleUpdatePassword = async (email, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      notify.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    setForgotLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al actualizar contraseña');

      notify.success('Contraseña actualizada con éxito');
      return true;

    } catch (err) {
      notify.error(err.message);
      return false;
    } finally {
      setForgotLoading(false);
    }
  };

  // -------- Render --------
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:py-16">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/5 rounded-full blur-xl animate-pulse-slower" />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative z-10 mt-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 flex items-center justify-center mb-3">
            <img src="/assets/logos/logo1.png" alt="Luxe Imports Logo" className="w-full h-full object-contain rounded-full shadow-md" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Bienvenido a Luxe Imports
          </h2>
          <p className="text-gray-600 text-sm text-center max-w-xs">
            Inicia sesión o crea tu cuenta para comenzar
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-md overflow-hidden border border-gray-100 bg-gray-50 p-1">
          <button
            className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${tab === "login" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setTab("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${tab === "register" ? "bg-gray-800 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
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
              onForgot={() => setShowForgotModal(true)}
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

      {/* Modals */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={handleCancelVerification}
        onVerify={handleVerifyCode}
        email={registerForm.email}
      />

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onSendCode={handleSendForgotCode}
        onVerifyCode={handleVerifyForgotCode}
        onUpdatePassword={handleUpdatePassword}
        loading={forgotLoading}
      />
    </main>
  );
}