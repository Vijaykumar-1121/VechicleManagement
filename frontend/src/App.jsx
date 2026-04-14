import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Careers from './pages/Careers';
import CustomerDashboard from './pages/CustomerDashboard'; // Not needed here directly but keep if useful later, actually let's remove and import RoleBasedDashboard
import RoleBasedDashboard from './components/RoleBasedDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isAuth = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      {!isDashboard && !isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/careers" element={<Careers />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <AppLayout />
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
    </>
  );
}

export default App;
