import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login.jsx'
import Register from './components/Register.jsx';
import PastPayments from './components/PastPayments.jsx';
import CreatePayment from './components/CreatePayment.jsx';
import Navbar from './components/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home.jsx';

function App() {
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
