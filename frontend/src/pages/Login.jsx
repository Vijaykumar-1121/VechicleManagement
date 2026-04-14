import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/authSlice';
import heroCar from '../assets/images/hero-car.png';
import logoImg from '../assets/logo.png';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

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
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth">
      {/* Visual side */}
      <div className="auth__visual">
        <img src={heroCar} alt="" className="auth__visual-img" />
        <div className="auth__visual-overlay">
          <h2>Welcome back.</h2>
          <p>Sign in to manage your vehicles, track services, and access your complete maintenance history.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="auth__form-side">
        <div className="auth__form-wrapper animate-fade-up">
          <Link to="/" className="auth__logo">
            <div className="auth__logo-icon" style={{background: 'transparent', boxShadow: 'none'}}><img src={logoImg} alt="AutoCare" style={{width: '28px', filter: 'invert(1)'}} /></div>
            <span className="auth__logo-text">AutoCare</span>
          </Link>

          <h1 className="auth__heading">Sign in to your account</h1>
          <p className="auth__subheading">Enter your credentials to access the dashboard</p>

          {isError && (
            <div className="auth__error">
              <i className="fas fa-exclamation-circle"></i>
              {message}
            </div>
          )}

          <form onSubmit={onSubmit}>
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
                  placeholder="••••••••"
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

            <div className="auth__options">
              <label className="auth__checkbox-label">
                <input type="checkbox" className="auth__checkbox" />
                Remember me
              </label>
              <a href="#" className="auth__forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="auth__submit" disabled={isLoading}>
              {isLoading ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth__footer">
            <p>Don't have an account? <Link to="/register" className="auth__footer-link">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
