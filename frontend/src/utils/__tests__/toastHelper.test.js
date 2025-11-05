import { toast } from 'react-toastify';
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast
} from '../toastHelper';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  },
  Slide: {}
}));

describe('Toast Helper Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showSuccessToast', () => {
    it('should call toast.success with message and default config', () => {
      const message = 'Success message';
      showSuccessToast(message);

      expect(toast.success).toHaveBeenCalledWith(message, expect.objectContaining({
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      }));
    });

    it('should merge custom config with defaults', () => {
      const message = 'Success message';
      const customConfig = { autoClose: 5000, theme: 'dark' };
      
      showSuccessToast(message, customConfig);

      expect(toast.success).toHaveBeenCalledWith(message, expect.objectContaining({
        position: 'top-right',
        autoClose: 5000,
        theme: 'dark'
      }));
    });
  });

  describe('showErrorToast', () => {
    it('should call toast.error with message and default config', () => {
      const message = 'Error message';
      showErrorToast(message);

      expect(toast.error).toHaveBeenCalledWith(message, expect.objectContaining({
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      }));
    });

    it('should merge custom config with defaults', () => {
      const message = 'Error message';
      const customConfig = { position: 'bottom-left', autoClose: 1000 };
      
      showErrorToast(message, customConfig);

      expect(toast.error).toHaveBeenCalledWith(message, expect.objectContaining({
        position: 'bottom-left',
        autoClose: 1000,
        theme: 'light'
      }));
    });
  });

  describe('showInfoToast', () => {
    it('should call toast.info with message and default config', () => {
      const message = 'Info message';
      showInfoToast(message);

      expect(toast.info).toHaveBeenCalledWith(message, expect.objectContaining({
        position: 'top-right',
        autoClose: 3000
      }));
    });
  });

  describe('showWarningToast', () => {
    it('should call toast.warning with message and default config', () => {
      const message = 'Warning message';
      showWarningToast(message);

      expect(toast.warning).toHaveBeenCalledWith(message, expect.objectContaining({
        position: 'top-right',
        autoClose: 3000
      }));
    });
  });
});