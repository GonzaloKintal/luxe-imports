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

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(0); // 0=email, 1=código, 2=nueva contraseña
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState(Array(5).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      navigate('/products', { replace: true });
    }
  }, [user, navigate]);

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

  // -------- Handlers de register --------
  async function handleRegister(e) {
    e.preventDefault();
    setRegisterTouched({ firstName: true, lastName: true, email: true, password: true, telefono: true });
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) return;
    setRegisterLoading(true);

    try {
      const payload = { ...registerForm, email: registerForm.email.trim(), telefono: registerForm.telefono ? registerForm.telefono.trim() : '' };
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrarse');

      setVerificationCode(Array(5).fill(''));
      setShowVerificationModal(true);
      toast.info('Te enviamos un código de verificación al correo');

    } catch (err) {
      toast.error(err.message);
      setRegisterLoading(false);
    }
  }

  async function handleVerifyCode() {
    const code = verificationCode.join('');
    if (code.length !== 5) return toast.error('Completa los 5 dígitos');

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

  const handleCodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      if (value && index < 4) document.getElementById(`code-input-${index + 1}`)?.focus();
    }
  };

  // -------- Forgot Password Handlers --------
  const handleForgotCodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...forgotCode];
      newCode[index] = value;
      setForgotCode(newCode);
      if (value && index < 4) document.getElementById(`forgot-code-input-${index + 1}`)?.focus();
    }
  };

  const handleVerifyForgotCode = async () => {
    const code = forgotCode.join('');
    if (code.length !== 5) return toast.error('Completa los 5 dígitos');
    setForgotLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código incorrecto');
      toast.success('Código verificado');
      setForgotStep(2); // Avanzar a nueva contraseña
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
  if (!newPassword || newPassword.length < 6)
    return toast.error('La contraseña debe tener al menos 6 caracteres');
  if (newPassword !== repeatPassword)
    return toast.error('Las contraseñas no coinciden');
  
  setForgotLoading(true);

  try {
	console.log({ email: forgotEmail, newPassword });
	const res = await fetch(`${API_URL}/api/auth/forgot-password/update`, {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({ email: forgotEmail, newPassword }),
	});
	const data = await res.json();
	console.log(data);

    if (!res.ok) throw new Error(data.error || 'Error al actualizar contraseña');

    toast.success('Contraseña actualizada con éxito', {
      autoClose: 1500,
      onClose: () => {
        setShowForgotModal(false);
        setForgotStep(0);
        setForgotEmail('');
        setForgotCode(Array(5).fill(''));
        setNewPassword('');
        setRepeatPassword('');
      }
    });
  } catch (err) {
    toast.error(err.message);
  } finally {
    setForgotLoading(false);
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
          <div className="w-32 h-32 flex items-center justify-center mb-3">
            <img 
              // CAMBIAR A LOGO SIN TEXTO
              src="/assets/logos/logo1.png" 
              alt="Luxe Imports Logo" 
              className="w-full h-full object-contain rounded-full shadow-md"
            />
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
              onForgot={() => {
                setShowForgotModal(true);
                setForgotStep(0);
              }}
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

      {/* Modal Verificación Registro */}
      {showVerificationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Verificación de Email</h3>
            <p className="text-sm text-gray-600 text-center mb-4">Te hemos enviado un código de 5 dígitos a tu correo. Ingrésalo a continuación.</p>
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
              <button onClick={handleCancelVerification} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</button>
              <button onClick={handleVerifyCode} className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900">Continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Forgot Password */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            {forgotStep === 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Recuperar Contraseña</h3>
                <p className="text-sm text-gray-600 text-center mb-4">Ingresa tu correo para recibir un código de recuperación</p>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <div className="flex justify-between">
                  <button onClick={() => setShowForgotModal(false)} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</button>
                  <button
                    onClick={async () => {
                      if (!forgotEmail) return toast.error("Ingresa tu email");
                      setForgotLoading(true);
                      try {
                        const res = await fetch(`${API_URL}/api/auth/forgot-password/send-code`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: forgotEmail }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "Error al enviar código");
                        toast.success("Código enviado al correo");
                        setForgotStep(1);
                        setForgotCode(Array(5).fill(''));
                      } catch (err) {
                        toast.error(err.message);
                      } finally {
                        setForgotLoading(false);
                      }
                    }}
                    className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-gray-900"
                  >
                    Enviar
                  </button>
                </div>
              </>
            )}
            {forgotStep === 1 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Código de recuperación</h3>
                <p className="text-sm text-gray-600 text-center mb-4">Ingresa el código de 5 dígitos enviado a tu correo</p>
                <div className="flex justify-center gap-2 mb-4">
                  {forgotCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`forgot-code-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleForgotCodeChange(e.target.value, index)}
                      className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setShowForgotModal(false)} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</button>
                  <button onClick={handleVerifyForgotCode} className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900">Continuar</button>
                </div>
              </>
            )}
            {forgotStep === 2 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Nueva Contraseña</h3>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <input
                  type="password"
                  placeholder="Repetir contraseña"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <div className="flex justify-between">
                  <button onClick={() => setShowForgotModal(false)} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</button>
                  <button onClick={handleUpdatePassword} className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900">Actualizar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
