import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import PastPayments from './components/PastPayments';
import CreatePayment from './components/CreatePayment';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';

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
