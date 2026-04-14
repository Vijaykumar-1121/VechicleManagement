import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { register, reset } from '../redux/authSlice';
import mechanicWork from '../assets/images/mechanic-work.png';
import logoImg from '../assets/logo.png';
import './Auth.css';

const Register = () => {
  const [searchParams] = useSearchParams();
  const presetRole = searchParams.get('role');
  const validRoles = ['customer', 'technician', 'service_center', 'admin'];
  const initialRole = (presetRole && validRoles.includes(presetRole)) ? presetRole : 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password, role }));
  };

  return (
    <div className="auth">
      {/* Visual side */}
      <div className="auth__visual">
        <img src={mechanicWork} alt="" className="auth__visual-img" />
        <div className="auth__visual-overlay">
          <h2>Join AutoCare.</h2>
          <p>Create your free account and experience the future of vehicle service management.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="auth__form-side">
        <div className="auth__form-wrapper animate-fade-up">
          <Link to="/" className="auth__logo">
            <div className="auth__logo-icon" style={{background: 'transparent', boxShadow: 'none'}}><img src={logoImg} alt="AutoCare" style={{width: '28px', filter: 'invert(1)'}} /></div>
            <span className="auth__logo-text">AutoCare</span>
          </Link>

          <h1 className="auth__heading">Create your account</h1>
          <p className="auth__subheading">Start managing your vehicle services in minutes</p>

          {isError && (
            <div className="auth__error">
              <i className="fas fa-exclamation-circle"></i>
              {message}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="auth__input-group">
              <label className="auth__input-label">Full name</label>
              <input
                type="text"
                className="auth__input"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="auth__input-group">
              <label className="auth__input-label">Email address</label>
              <input
                type="email"
                className="auth__input"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth__input-group">
              <label className="auth__input-label">Password</label>
              <div className="auth__input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth__input"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  className="auth__eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="auth__input-group">
              <label className="auth__input-label">I am a</label>
              <select
                className="auth__input auth__select"
                name="role"
                value={role}
                onChange={onChange}
              >
                <option value="customer">Vehicle Owner</option>
                <option value="technician">Technician</option>
                <option value="service_center">Service Center Staff</option>
                <option value="admin">System Admin (Testing Only)</option>
              </select>
            </div>

            <button type="submit" className="auth__submit mt-3" disabled={isLoading}>
              {isLoading ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth__footer">
            <p>Already have an account? <Link to="/login" className="auth__footer-link">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
