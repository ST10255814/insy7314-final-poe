import { toast, Slide } from "react-toastify";

// Khadra, F. 2025. React-toastify. GitHub. [online] Available at: <https://fkhadra.github.io/react-toastify/introduction/>
// [Accessed 2 October 2025].
const defaultToastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Slide,
};

export const showSuccessToast = (message, config = {}) => {
  toast.success(message, { ...defaultToastConfig, ...config });
};

export const showErrorToast = (message, config = {}) => {
  toast.error(message, { ...defaultToastConfig, ...config });
};

export const showInfoToast = (message, config = {}) => {
  toast.info(message, { ...defaultToastConfig, ...config });
};

export const showWarningToast = (message, config = {}) => {
  toast.warning(message, { ...defaultToastConfig, ...config });
};
