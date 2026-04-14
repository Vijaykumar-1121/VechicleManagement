import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CustomerDashboard from '../pages/CustomerDashboard';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import ServiceCenterDashboard from '../pages/ServiceCenterDashboard';
import AdminDashboard from '../pages/AdminDashboard';

const RoleBasedDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'service_center':
      return <ServiceCenterDashboard />;
    case 'technician':
      return <TechnicianDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
};

export default RoleBasedDashboard;
