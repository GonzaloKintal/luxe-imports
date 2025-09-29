import { useState, useEffect } from 'react';

export default function VerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  email 
}) {
    
  const [verificationCode, setVerificationCode] = useState(Array(5).fill(''));

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
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      if (value && index < 4) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const code = verificationCode.join('');
    if (code.length !== 5) return;
    onVerify(code);
  };

  const handleCancel = () => {
    setVerificationCode(Array(5).fill(''));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 px-6 flex items-center justify-center bg-black/50 z-50">
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
            onClick={handleCancel} 
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
  
}