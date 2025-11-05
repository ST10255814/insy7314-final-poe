import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from '../Login';
import api from '../../lib/axios';

// Increase Jest timeout for async tests
jest.setTimeout(10000);

// Mock setTimeout to resolve immediately
global.setTimeout = jest.fn((cb) => cb());

// Mock the axios module
jest.mock('../../lib/axios');
const mockedApi = api;

// Mock the toast helper
jest.mock('../../utils/toastHelper', () => ({
  showErrorToast: jest.fn(),
  showSuccessToast: jest.fn()
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
      <ToastContainer />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    
    // Mock the CSRF token request that happens on component mount
    mockedApi.get.mockResolvedValue({
      data: { csrfToken: 'mock-csrf-token' }
    });
  });

  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Account number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const accountInput = screen.getByPlaceholderText('Account number');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(accountInput, { target: { value: '12345678' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(accountInput.value).toBe('12345678');
    expect(passwordInput.value).toBe('TestPass123!');
  });

  it('shows loading state during form submission', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Mock successful API response
    mockedApi.post.mockResolvedValueOnce({
      data: {
        message: 'Login successful',
        user: { fullName: 'Test User', role: 'Customer' }
      }
    });
    
    // Fill form with valid data
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Account number'), {
      target: { value: '12345678' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'TestPass123!' }
    });
    
    fireEvent.click(submitButton);
    
    // Should show loading text
    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });

  it('handles successful login for customer', async () => {
    renderLogin();
    
    const mockResponse = {
      data: {
        message: 'Login successful',
        user: { fullName: 'Test User', role: 'Customer' }
      }
    };
    
    mockedApi.post.mockResolvedValueOnce(mockResponse);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Account number'), {
      target: { value: '12345678' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'TestPass123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(sessionStorage.getItem('user')).toBe('"Test User"');
    });
    
    expect(sessionStorage.getItem('userRole')).toBe('Customer');
    expect(mockNavigate).toHaveBeenCalledWith('/pastPayments');
  });

  it('handles successful login for employee', async () => {
    renderLogin();
    
    const mockResponse = {
      data: {
        message: 'Login successful',
        user: { fullName: 'Test Employee', role: 'Employee' }
      }
    };
    
    mockedApi.post.mockResolvedValueOnce(mockResponse);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testemployee' }
    });
    fireEvent.change(screen.getByPlaceholderText('Account number'), {
      target: { value: '87654321' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'TestPass123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(sessionStorage.getItem('user')).toBe('"Test Employee"');
    });
    
    expect(sessionStorage.getItem('userRole')).toBe('Employee');
    expect(mockNavigate).toHaveBeenCalledWith('/employee/dashboard');
  });

  it('handles API error during login', async () => {
    const { showErrorToast } = require('../../utils/toastHelper');
    renderLogin();
    
    const errorResponse = {
      response: {
        data: { error: 'Invalid credentials' }
      }
    };
    
    mockedApi.post.mockRejectedValueOnce(errorResponse);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Account number'), {
      target: { value: '12345678' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'TestPass123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('validates form inputs and shows validation errors', async () => {
    const { showErrorToast } = require('../../utils/toastHelper');
    renderLogin();
    
    // Submit form with invalid data
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'x' } // Too short
    });
    fireEvent.change(screen.getByPlaceholderText('Account number'), {
      target: { value: '123' } // Too short
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'weak' } // Too short
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalled();
    }, { timeout: 4000 });
  });

  it('renders register link correctly', () => {
    renderLogin();
    
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});