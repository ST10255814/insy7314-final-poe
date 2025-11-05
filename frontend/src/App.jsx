import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import Login from './components/Login.jsx'
import Register from './components/Register.jsx';
import PastPayments from './components/PastPayments.jsx';
import CreatePayment from './components/CreatePayment.jsx';
import EmployeeDashboard from './components/EmployeeDashboard.jsx';
import SubmittedPayments from './components/SubmittedPayments.jsx';
import Navbar from './components/Navbar.jsx';
import EmployeeRoute, { CustomerRoute } from './components/EmployeeRoute.jsx';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home.jsx';
import api from './lib/axios.js';

function App() {
  // Fetch CSRF token when app loads
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        // Make a request to get CSRF token
        const response = await api.get('/api/csrf-token')
        console.log('CSRF token fetched:', response.data.csrfToken)
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }
    
    fetchCSRFToken()
  }, [])

  return (
    <Router>
        <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        
        {/* Customer Routes - Protected */}
        <Route path='/pastPayments' element={
          <CustomerRoute>
            <PastPayments/>
          </CustomerRoute>
        } />
        <Route path='/createPayment' element={
          <CustomerRoute>
            <CreatePayment/>
          </CustomerRoute>
        } />
        
        {/* Employee Routes - Protected */}
        <Route path='/employee/dashboard' element={
          <EmployeeRoute>
            <EmployeeDashboard/>
          </EmployeeRoute>
        } />
        <Route path='/employee/submitted' element={
          <EmployeeRoute>
            <SubmittedPayments/>
          </EmployeeRoute>
        } />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
