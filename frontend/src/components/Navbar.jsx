import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon" style={{background: 'transparent', boxShadow: 'none'}}>
            <img src={logoImg} alt="AutoCare Logo" style={{width: '28px', height: 'auto', filter: 'invert(1)'}} />
          </div>
          <span className="navbar__logo-text">Auto<span className="text-gradient">Care</span></span>
        </Link>

        <button className="navbar__toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={`navbar__hamburger ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`navbar__menu ${isOpen ? 'navbar__menu--open' : ''}`}>
          <div className="navbar__links">
            <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>
              Home
            </Link>
            <a href="/#services" className="navbar__link">
              Services
            </a>
            <a href="/#about" className="navbar__link">
              About
            </a>
            <Link to="/careers" className={`navbar__link ${location.pathname === '/careers' ? 'navbar__link--active' : ''}`}>
              Careers
            </Link>
          </div>

          <div className="navbar__actions">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost">
                  <i className="fas fa-grip-horizontal"></i> Dashboard
                </Link>
                <button className="btn btn-outline btn-sm" onClick={onLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started <i className="fas fa-arrow-right"></i>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
