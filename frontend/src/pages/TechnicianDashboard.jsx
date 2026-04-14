import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset as resetAuth } from '../redux/authSlice';
import { getAllAppointments, updateAppointmentStatus, reset as resetAppointment } from '../redux/appointmentSlice';
import { createServiceRecord } from '../redux/serviceRecordSlice';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import './Dashboard.css';

const TechnicianDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointment);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue');

  // Service Record Modal
  const [recordModal, setRecordModal] = useState({ isOpen: false, appointment: null });
  const [repairDetails, setRepairDetails] = useState('');
  const [replacedParts, setReplacedParts] = useState('');

  // Polling for real-time global queue updates (every 10 seconds)
  useEffect(() => {
    if (user) {
      dispatch(getAllAppointments());
      
      const intervalId = setInterval(() => {
        dispatch(getAllAppointments());
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [user, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetAuth());
    dispatch(resetAppointment());
    navigate('/');
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateAppointmentStatus({ id, status: newStatus }));
  };

  const tabs = [
    { id: 'queue', icon: 'fa-clipboard-list', label: 'My Assigned Work' },
    { id: 'completed', icon: 'fa-check-double', label: 'Completed Jobs' },
  ];

  // ONLY show appointments ASSIGNED to this specific technician
  const assignedAppointments = appointments.filter(a => a.technicianId && (a.technicianId._id === user._id || a.technicianId === user._id));

  const pendingApps = assignedAppointments.filter(a => a.status === 'Booked' || a.status === 'In Progress');
  const completedApps = assignedAppointments.filter(a => a.status === 'Completed' || a.status === 'Awaiting Invoice');
  const inProgressApps = assignedAppointments.filter(a => a.status === 'In Progress');

  const handleFinalizeJob = (e) => {
    e.preventDefault();
    if (recordModal.appointment) {
        // Dispatch Service Record creation
        dispatch(createServiceRecord({
            vehicleId: recordModal.appointment.vehicleId?._id,
            appointmentId: recordModal.appointment._id,
            repairDetails: repairDetails,
            replacedParts: replacedParts.split(',').map(p => p.trim()),
            serviceStatus: 'Completed'
        }));
        // Update Actual Appointment Status
        dispatch(updateAppointmentStatus({ id: recordModal.appointment._id, status: 'Awaiting Invoice' }));
        
        // Reset and close
        setRecordModal({ isOpen: false, appointment: null });
        setRepairDetails('');
        setReplacedParts('');
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'queue':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h1 className="heading-lg">Technician Portal, <span className="text-gradient">{user?.name}</span></h1>
                <p className="text-body mt-2">Manage your active service tickets and vehicle queue.</p>
              </div>
            </div>

            <div className="dash__metrics">
              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--amber">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{assignedAppointments.filter(a => a.status === 'Booked').length}</p>
                <p className="dash__metric-label">Waiting in My Queue</p>
              </div>

              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--blue">
                    <i className="fas fa-wrench"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{inProgressApps.length}</p>
                <p className="dash__metric-label">Currently Working On</p>
              </div>

              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--green">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{completedApps.length}</p>
                <p className="dash__metric-label">Jobs Completed</p>
              </div>
            </div>

            <div className="dash__table-card card mt-8">
              <div className="dash__table-header">
                <h3 className="heading-sm">My Active Service Queue</h3>
              </div>
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Vehicle ID / Owner</th>
                      <th>Service Required</th>
                      <th>Scheduled Date</th>
                      <th>Action / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApps.map(app => {
                      return (
                        <tr key={app._id}>
                          <td>
                            <div className="dash__vehicle-cell">
                              <div className="dash__vehicle-icon"><i className="fas fa-tools"></i></div>
                              <div>
                                <strong>{app.vehicleId?.vehicleNumber || 'Unknown'}</strong>
                                <span>{app.vehicleId?.model || 'Unknown Model'}</span>
                              </div>
                            </div>
                          </td>
                          <td><strong>{app.serviceType}</strong></td>
                          <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            {app.status === 'Booked' ? (
                                <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(app._id, 'In Progress')}>
                                  Start Job
                                </button>
                            ) : (
                                <button className="btn btn-outline btn-sm" style={{borderColor: 'var(--success-color)', color: 'var(--success-color)'}} onClick={() => setRecordModal({isOpen: true, appointment: app})}>
                                  Complete & Log
                                </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {pendingApps.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center p-8 text-secondary">
                          <i className="fas fa-coffee center-block mb-3" style={{ fontSize: '2rem' }}></i><br/>
                          No active jobs in the queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h2 className="heading-md">Completed Jobs</h2>
                <p className="text-body mt-1">History of all finalized service tickets.</p>
              </div>
            </div>
            <div className="dash__table-card card">
               <div className="dash__table-wrap">
                  <table className="dash__table">
                    <thead>
                      <tr>
                        <th>Date Completed</th>
                        <th>Vehicle</th>
                        <th>Service Rendered</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedApps.map(app => {
                        return (
                          <tr key={app._id}>
                            <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                            <td>{app.vehicleId?.vehicleNumber ? `${app.vehicleId.vehicleNumber} (${app.vehicleId.model})` : 'Unknown'}</td>
                            <td>{app.serviceType}</td>
                            <td><span className={`badge ${app.status === 'Awaiting Invoice' ? 'badge-warning' : 'badge-success'}`}>{app.status}</span></td>
                          </tr>
                        );
                      })}
                      {completedApps.length === 0 && (
                        <tr><td colSpan="4" className="text-center p-6 text-secondary">No completed jobs yet.</td></tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="dash">
      <aside className="dash__sidebar">
        <div className="dash__sidebar-top">
          <div className="dash__sidebar-logo">
            <div className="dash__sidebar-logo-icon" style={{background: 'transparent', boxShadow: 'none'}}>
              <img src={logoImg} alt="AutoCare Logo" style={{width: '24px', filter: 'invert(1)'}} />
            </div>
            <span className="dash__sidebar-logo-text">AutoCare<span style={{color: '#10b981', marginLeft: '5px'}}>Pro</span></span>
          </div>

          <nav className="dash__nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`dash__nav-item ${activeTab === tab.id ? 'dash__nav-item--active' : ''}`}
                onClick={() => { setActiveTab(tab.id); }}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dash__sidebar-bottom">
          <div className="dash__user-card">
            <div className="dash__user-avatar" style={{background: 'var(--bg-surface)', border: '1px solid var(--border)'}}>
              <i className="fas fa-user-cog" style={{color: '#10b981'}}></i>
            </div>
            <div className="dash__user-info">
              <strong>{user?.name || 'Technician'}</strong>
              <span className="text-xs" style={{textTransform: 'capitalize', letterSpacing: 'normal', color: '#10b981'}}>{user?.role}</span>
            </div>
          </div>
          <button className="btn btn-ghost w-full mt-3" onClick={onLogout} style={{justifyContent: 'flex-start', color: 'var(--text-tertiary)'}}>
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </aside>

      <main className="dash__main">
        {renderContent()}

        {/* Finalize Service Modal */}
        {recordModal.isOpen && (
            <div className="modal-backdrop" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 7, 12, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out'}}>
                <div className="card p-8 relative" style={{width: '550px', maxWidth: '95%', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)', animation: 'slideUp 0.3s ease-out'}}>
                    
                    <div className="d-flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <h3 className="heading-sm" style={{display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-clipboard-check mr-3" style={{color: '#10b981', fontSize: '1.25rem'}}></i>
                            Service Job Finalization
                        </h3>
                        <button className="btn btn-ghost" style={{padding: '0.5rem', width: '32px', height: '32px', borderRadius: '50%', color: 'var(--text-tertiary)'}} onClick={() => setRecordModal({isOpen: false, appointment: null})}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleFinalizeJob}>
                        <div className="form-group mb-5">
                            <label className="auth__input-label" style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fas fa-file-signature mr-2 text-secondary"></i> Detailed Repair Notes
                            </label>
                            <textarea className="auth__input" rows="5" value={repairDetails} onChange={(e) => setRepairDetails(e.target.value)} required placeholder="Document the completed labor, fluid changes, and inspection details here..." style={{background: 'rgba(255,255,255,0.03)', resize: 'none'}}></textarea>
                        </div>
                        <div className="form-group mb-6">
                            <label className="auth__input-label" style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fas fa-cogs mr-2 text-secondary"></i> Replaced Parts (Inventory Tracking)
                            </label>
                            <input type="text" className="auth__input" value={replacedParts} onChange={(e) => setReplacedParts(e.target.value)} placeholder="e.g. Oil Filter, Alternator Belt (comma separated)" style={{background: 'rgba(255,255,255,0.03)'}} />
                            <small className="text-secondary mt-2 d-block" style={{fontSize: '0.75rem'}}><i className="fas fa-info-circle mr-1"></i> These will be officially logged to the vehicle history.</small>
                        </div>
                        <div className="d-flex gap-3 pt-4 border-t border-white/5" style={{justifyContent: 'flex-end'}}>
                            <button type="button" className="btn btn-outline" onClick={() => setRecordModal({isOpen: false, appointment: null})}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{background: '#10b981', color: '#111827', fontWeight: 'bold', border: 'none'}}>
                                <i className="fas fa-check-double mr-2"></i> Lock & Finalize
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default TechnicianDashboard;
