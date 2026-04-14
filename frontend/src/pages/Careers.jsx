import { Link } from 'react-router-dom';
import './Careers.css';

const careers = [
  {
    title: 'Automotive Technician',
    location: 'Amaravati, AP',
    type: 'Full-time',
    badge: 'Now Hiring',
    badgeColor: '#10b981',
    icon: 'fa-wrench',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    role: 'technician',
    perks: [
      'Hands-on diagnostics & repair work',
      'Access to latest tools & technology',
      'Competitive salary & growth path',
      'Health insurance & paid leave',
    ],
    desc: 'Join our team of expert mechanics and work on a wide variety of vehicles. You\'ll diagnose issues, perform repairs, and ensure every car leaves in peak condition.',
  },
  {
    title: 'Service Center Staff',
    location: 'Amaravati, AP',
    type: 'Full-time',
    badge: 'Open Roles',
    badgeColor: '#8b5cf6',
    icon: 'fa-headset',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    role: 'service_center',
    perks: [
      'Manage appointments & invoicing',
      'Customer interaction & support',
      'Administrative operations',
      'Team coordination & scheduling',
    ],
    desc: 'Be the face of AutoCare. Handle customer relations, coordinate service schedules, and keep our operations running smoothly.',
  },
];

const Careers = () => {
  return (
    <div className="careers-page">
      {/* Hero */}
      <section className="careers-hero">
        <div className="careers-hero__bg"></div>
        <div className="container careers-hero__content">
          <span className="careers-hero__badge">
            <i className="fas fa-briefcase"></i> We're Hiring
          </span>
          <h1 className="careers-hero__title">
            Build Your Career<br />
            <span className="text-gradient">with AutoCare</span>
          </h1>
          <p className="careers-hero__subtitle">
            Join a passionate team transforming the vehicle service industry across Andhra Pradesh.
            We value skill, growth, and a love for automobiles.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="careers-why section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs accent mb-4" style={{display: 'block'}}>Why AutoCare</span>
            <h2 className="heading-lg mb-4">A Workplace That Drives You Forward</h2>
          </div>
          <div className="careers-why__grid">
            {[
              { icon: 'fa-chart-line', title: 'Career Growth', desc: 'Clear promotion paths and skill development programs for every role.' },
              { icon: 'fa-users', title: 'Great Team', desc: 'Work alongside experienced professionals who share your passion.' },
              { icon: 'fa-shield-alt', title: 'Job Security', desc: 'Stable full-time positions with competitive compensation packages.' },
              { icon: 'fa-heart', title: 'Work-Life Balance', desc: 'Flexible schedules, paid time off, and employee wellness programs.' },
            ].map((b, i) => (
              <div key={i} className="careers-why__card card">
                <div className="careers-why__card-icon">
                  <i className={`fas ${b.icon}`}></i>
                </div>
                <h3 className="heading-sm mt-4 mb-2" style={{color: '#f1f5f9'}}>{b.title}</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="careers-positions section" id="positions">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs accent mb-4" style={{display: 'block'}}>Open Positions</span>
            <h2 className="heading-lg mb-4">Find Your Perfect Role</h2>
            <p className="text-body" style={{maxWidth: '560px', margin: '0 auto'}}>
              Choose the career path that suits your skills and start your journey with us today.
            </p>
          </div>

          <div className="careers-positions__grid">
            {careers.map((c, i) => (
              <div key={i} className="careers-positions__card card">
                <div className="careers-positions__card-header">
                  <div className="careers-positions__card-icon" style={{background: c.iconBg, color: c.badgeColor}}>
                    <i className={`fas ${c.icon}`}></i>
                  </div>
                  <div className="careers-positions__card-meta">
                    <span className="careers-positions__badge" style={{background: c.iconBg, color: c.badgeColor, borderColor: c.badgeColor}}>
                      {c.badge}
                    </span>
                    <span className="careers-positions__type">{c.type}</span>
                  </div>
                </div>

                <h3 className="heading-md mt-6 mb-2" style={{color: '#f1f5f9'}}>{c.title}</h3>
                <p className="text-sm mb-2" style={{color: 'var(--text-tertiary)'}}>
                  <i className="fas fa-map-marker-alt" style={{marginRight: '6px'}}></i>{c.location}
                </p>
                <p className="text-sm mb-6" style={{color: 'var(--text-secondary)', lineHeight: '1.7'}}>{c.desc}</p>

                <div className="careers-positions__perks">
                  <p className="text-xs" style={{color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>What you'll do</p>
                  <ul className="careers__perks">
                    {c.perks.map((p, j) => (
                      <li key={j}><i className="fas fa-check"></i> {p}</li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to={`/register?role=${c.role}`} 
                  className="btn btn-primary careers-positions__apply"
                  style={c.badgeColor === '#8b5cf6' ? {background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'} : {}}
                >
                  Apply Now <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="careers-cta section">
        <div className="container">
          <div className="careers-cta__box card">
            <h2 className="heading-lg mb-4" style={{color: '#f1f5f9'}}>Don't See Your Role?</h2>
            <p className="text-body mb-6" style={{maxWidth: '480px', margin: '0 auto 24px'}}>
              We're always looking for talented people. Send us your resume and we'll reach out when the right position opens up.
            </p>
            <a href="mailto:careers@autocare.in" className="btn btn-outline">
              <i className="fas fa-envelope"></i> careers@autocare.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
