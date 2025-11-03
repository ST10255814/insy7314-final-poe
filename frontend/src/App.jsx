import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import Login from './components/Login.jsx'
import Register from './components/Register.jsx';
import PastPayments from './components/PastPayments.jsx';
import CreatePayment from './components/CreatePayment.jsx';
import Navbar from './components/Navbar.jsx';
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
        <Route path='/pastPayments' element={<PastPayments/>} />
        <Route path='/createPayment' element={<CreatePayment/>} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
