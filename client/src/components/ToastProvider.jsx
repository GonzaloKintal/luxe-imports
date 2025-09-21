// src/components/ToastProvider.jsx
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function useNotify() {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    warning: (msg) => toast.warning(msg),
    info: (msg) => toast.info(msg),
  };
}

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
