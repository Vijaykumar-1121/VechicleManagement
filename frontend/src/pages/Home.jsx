import { Link, useNavigate } from 'react-router-dom';
import heroCar from '../assets/images/hero-car.png';
import mechanicWork from '../assets/images/mechanic-work.png';
import carInterior from '../assets/images/car-interior.png';
import './Home.css';

const Home = () => {
  const stats = [
    { value: '15K+', label: 'Vehicles Serviced' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '200+', label: 'Expert Technicians' },
    { value: '24/7', label: 'Support Available' },
  ];

  const services = [
    {
      icon: 'fa-oil-can',
      title: 'Oil & Fluid Change',
      desc: 'Premium synthetic oils and fluid replacement with manufacturer-recommended specifications.',
      tag: 'Popular',
      color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.12)'
    },
    {
      icon: 'fa-gears',
      title: 'Engine Diagnostics',
      desc: 'Advanced OBD-II scanning and comprehensive engine performance analysis.',
      tag: 'Advanced',
      color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)', bg: 'rgba(139, 92, 246, 0.12)'
    },
    {
      icon: 'fa-shield-halved',
      title: 'Brake Inspection',
      desc: 'Complete brake system evaluation including pads, rotors, calipers, and fluid lines.',
      color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', bg: 'rgba(239, 68, 68, 0.12)'
    },
    {
      icon: 'fa-car-battery',
      title: 'Battery & Electrical',
      desc: 'Battery health testing, alternator diagnostics, and full electrical system check.',
      color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.12)'
    },
    {
      icon: 'fa-tools',
      title: 'Tire & Alignment',
      desc: 'Tire rotation, balancing, pressure optimization, and precision wheel alignment.',
      color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.12)'
    },
    {
      icon: 'fa-screwdriver-wrench',
      title: 'General Servicing',
      desc: 'Multi-point inspection covering all essential systems for peak performance.',
      tag: 'Essential',
      color: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)', bg: 'rgba(14, 165, 233, 0.12)'
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Register & Add Vehicle',
      desc: 'Create your account and enter your vehicle details — make, model, year, and mileage.',
    },
    {
      num: '02',
      title: 'Book a Service',
      desc: 'Choose the service type, select your preferred date and time slot from available options.',
    },
    {
      num: '03',
      title: 'Track in Real-Time',
      desc: 'Monitor your service progress from drop-off to completion with live status updates.',
    },
    {
      num: '04',
      title: 'Collect & Review',
      desc: 'Receive your digital invoice, review the work done, and build your service history.',
    },
  ];

  return (
    <div className="home">
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <img src={heroCar} alt="" className="hero__bg-img" />
          <div className="hero__bg-overlay"></div>
          <div className="hero__bg-grain"></div>
        </div>

        <div className="container hero__container">
          <div className="hero__content">
            <div className="hero__badge animate-fade-up">
              <i className="fas fa-shield-halved"></i>
              <span>Trusted by 15,000+ vehicle owners</span>
            </div>

            <h1 className="heading-xl animate-fade-up delay-1">
              Premium Vehicle <br />
              Service, <span className="text-gradient">Simplified.</span>
            </h1>

            <p className="text-body-lg animate-fade-up delay-2" style={{maxWidth: '540px'}}>
              Book appointments, track repairs in real-time, and maintain your complete 
              service history — all from one intelligent platform.
            </p>

            <div className="hero__actions animate-fade-up delay-3">
              <Link to="/register" className="btn btn-primary btn-lg">
                Book Your Service <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero__stats animate-fade-up delay-5">
          <div className="container">
            <div className="hero__stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="hero__stat">
                  <span className="hero__stat-value">{stat.value}</span>
                  <span className="hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── About / Diagnostics Split ────────────────── */}
      <section className="about section" id="about">
        <div className="container">
          <div className="about__grid">
            <div className="about__images">
              <div className="about__img-main">
                <img src={mechanicWork} alt="Professional mechanic using diagnostic tools" />
              </div>
              <div className="about__img-secondary">
                <img src={carInterior} alt="Luxury car interior diagnostics" />
              </div>
              <div className="about__img-badge card">
                <i className="fas fa-award" style={{color: 'var(--accent-light)', fontSize: '1.5rem'}}></i>
                <div>
                  <strong style={{color: 'var(--text-white)'}}>ISO Certified</strong>
                  <span className="text-sm" style={{display: 'block'}}>Quality Assured</span>
                </div>
              </div>
            </div>

            <div className="about__content">
              <span className="text-xs accent mb-4" style={{display: 'block'}}>Why AutoCare</span>
              <h2 className="heading-lg mb-6">
                Precision Diagnostics. <br />Transparent Service.
              </h2>
              <p className="text-body mb-8">
                We combine expert craftsmanship with cutting-edge diagnostic technology to deliver
                unmatched vehicle care. Every repair is documented, every part is tracked, 
                and every update is shared with you in real-time.
              </p>

              <div className="about__features">
                <div className="about__feature">
                  <div className="about__feature-icon">
                    <i className="fas fa-satellite-dish"></i>
                  </div>
                  <div>
                    <h4 className="heading-sm mb-1">Real-Time Tracking</h4>
                    <p className="text-sm">Monitor every stage of your vehicle's service journey live.</p>
                  </div>
                </div>
                <div className="about__feature">
                  <div className="about__feature-icon">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <div>
                    <h4 className="heading-sm mb-1">Digital Invoices</h4>
                    <p className="text-sm">Transparent, itemized billing with no hidden costs.</p>
                  </div>
                </div>
                <div className="about__feature">
                  <div className="about__feature-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h4 className="heading-sm mb-1">Certified Experts</h4>
                    <p className="text-sm">Factory-trained technicians with years of experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services ─────────────────────────────────── */}
      <section className="services section" id="services">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs accent mb-4" style={{display: 'block'}}>What We Offer</span>
            <h2 className="heading-lg mb-4">Comprehensive Service Menu</h2>
            <p className="text-body" style={{maxWidth: '560px', margin: '0 auto'}}>
              From routine maintenance to complex diagnostics — we handle it all with precision and care.
            </p>
          </div>

          <div className="services__grid">
            {services.map((s, i) => (
              <div 
                key={i} 
                className="services__card card"
                style={{
                  '--card-color': s.color, 
                  '--card-glow': s.glow, 
                  '--card-bg': s.bg
                }}
              >
                {s.tag && <span className="services__tag">{s.tag}</span>}
                <div className="services__card-icon">
                  <i className={`fas ${s.icon}`}></i>
                </div>
                <h3 className="heading-sm mt-6 mb-3" style={{color: '#f1f5f9'}}>{s.title}</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────── */}
      <section className="steps section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs accent mb-4" style={{display: 'block'}}>How It Works</span>
            <h2 className="heading-lg mb-4">Four Steps to Effortless Service</h2>
            <p className="text-body" style={{maxWidth: '500px', margin: '0 auto'}}>
              From your first click to your car back on the road, here's the process.
            </p>
          </div>

          <div className="steps__grid">
            {steps.map((step, i) => (
              <div key={i} className="steps__item">
                <div className="steps__number">{step.num}</div>
                <h3 className="heading-sm mb-3">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
                {i < steps.length - 1 && <div className="steps__connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <section className="testimonials section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs accent mb-4" style={{display: 'block'}}>Testimonials</span>
            <h2 className="heading-lg mb-4">What Our Clients Say</h2>
          </div>

          <div className="testimonials__grid">
            <div className="testimonials__card card p-8">
              <div className="testimonials__stars mb-4">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="testimonials__star">{s}</span>)}
              </div>
              <p className="text-body mb-6">
                "AutoCare transformed how I manage my fleet. The real-time tracking and 
                digital invoices save me hours every week. Absolutely essential."
              </p>
              <div className="testimonials__author">
                <div className="testimonials__avatar">RK</div>
                <div>
                  <strong style={{color: 'var(--text-white)'}}>Ravi Kumar</strong>
                  <p className="text-sm">Fleet Manager, 12 vehicles</p>
                </div>
              </div>
            </div>

            <div className="testimonials__card card p-8">
              <div className="testimonials__stars mb-4">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="testimonials__star">{s}</span>)}
              </div>
              <p className="text-body mb-6">
                "I never forget a service date anymore. The reminders are perfect, and being 
                able to see exactly what the mechanic did gives me total peace of mind."
              </p>
              <div className="testimonials__author">
                <div className="testimonials__avatar">SP</div>
                <div>
                  <strong style={{color: 'var(--text-white)'}}>Shalini Patel</strong>
                  <p className="text-sm">Car Owner, Hyundai i20</p>
                </div>
              </div>
            </div>

            <div className="testimonials__card card p-8">
              <div className="testimonials__stars mb-4">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="testimonials__star">{s}</span>)}
              </div>
              <p className="text-body mb-6">
                "As a technician, the dashboard is incredibly intuitive. I can log repairs, 
                update status, and manage parts all in one place. Great platform."
              </p>
              <div className="testimonials__author">
                <div className="testimonials__avatar">AK</div>
                <div>
                  <strong style={{color: 'var(--text-white)'}}>Arun K.</strong>
                  <p className="text-sm">Senior Technician, 8 yrs exp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
