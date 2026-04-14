import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top CTA strip */}
        <div className="footer__cta card">
          <div className="footer__cta-content">
            <h3 className="heading-md">Ready to simplify your vehicle service?</h3>
            <p className="text-body mt-2">Join thousands of vehicle owners who trust AutoCare for their maintenance needs.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* Main footer grid */}
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="d-flex items-center gap-3 mb-6">
              <div className="footer__logo-icon" style={{background: 'transparent', boxShadow: 'none'}}>
                <img src={logoImg} alt="AutoCare Logo" style={{width: '32px', height: 'auto', filter: 'invert(1)'}} />
              </div>
              <span className="footer__logo-text">Auto<span className="text-gradient">Care</span></span>
            </div>
            <p className="text-body">
              The modern way to manage vehicle maintenance. Book, track, and maintain complete service records — all in one platform.
            </p>
            <div className="footer__social mt-6">
              <a href="#" className="footer__social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="footer__social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="footer__social-icon" aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="#" className="footer__social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Platform</h4>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><a href="/#services">Services</a></li>
              <li><Link to="/register">Book Appointment</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <ul className="footer__links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Support</h4>
            <ul className="footer__links">
              <li><a href="mailto:support@autocare.com"><i className="fas fa-envelope" style={{marginRight: '8px', opacity: 0.5}}></i>support@autocare.com</a></li>
              <li><a href="tel:+18001234567"><i className="fas fa-phone" style={{marginRight: '8px', opacity: 0.5}}></i>+1 800 123 4567</a></li>
              <li><a href="#"><i className="fas fa-map-marker-alt" style={{marginRight: '8px', opacity: 0.5}}></i>Andhra Pradesh, Amaravati</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="text-xs" style={{textTransform: 'none', letterSpacing: 'normal', fontWeight: 400}}>
            © {new Date().getFullYear()} AutoCare Inc. All rights reserved.
          </p>
          <div className="footer__bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
