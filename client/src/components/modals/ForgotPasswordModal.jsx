import { useState, useEffect } from 'react';

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose, 
  onSendCode,
  onVerifyCode,
  onUpdatePassword,
  loading 
}) {
    
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(5).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 4) {
        document.getElementById(`forgot-code-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleSendCode = async () => {
    if (!email) return;
    const success = await onSendCode(email.trim().toLowerCase());
    if (success) {
      setStep(1);
      setCode(Array(5).fill(''));
    }
  };

  const handleVerifyCode = async () => {
    const codeString = code.join('');
    if (codeString.length !== 5) return;
    const success = await onVerifyCode(email.trim().toLowerCase(), codeString);
    if (success) {
      setStep(2);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== repeatPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    const success = await onUpdatePassword(email.trim().toLowerCase(), newPassword);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setStep(0);
    setEmail('');
    setCode(Array(5).fill(''));
    setNewPassword('');
    setRepeatPassword('');
    setPasswordError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 px-6 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        {/* Paso 0: Enviar correo */}
        {step === 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Recuperar Contraseña
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Ingresa tu correo para recibir un código de recuperación
            </p>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              autoComplete="off"
              spellCheck="false"
              inputMode="email"
              autoCapitalize="none"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <div className="flex justify-between">
              <button 
                onClick={handleClose} 
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendCode}
                className="px-4 py-2 cursor-pointer rounded-md bg-gray-800 text-white hover:bg-gray-900"
                disabled={loading}
                style={loading ? { opacity: 0.6, pointerEvents: 'none' } : {}}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        )}

        {/* Paso 1: Ingresar código */}
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Código de recuperación
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Ingresa el código de 5 dígitos enviado a tu correo
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`forgot-code-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button 
                onClick={handleClose} 
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleVerifyCode} 
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          </>
        )}

        {/* Paso 2: Nueva contraseña */}
        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Nueva Contraseña
            </h3>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <input
              type="password"
              placeholder="Repetir contraseña"
              value={repeatPassword}
              autoComplete="new-password"
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />

            {passwordError && (
              <p className="text-red-600 text-sm mb-2">{passwordError}</p>
            )}

            <div className="flex justify-between mt-2">
              <button 
                onClick={handleClose} 
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdatePassword} 
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
