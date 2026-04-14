import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset as resetAuth, getAllUsers } from '../redux/authSlice';
import { getAllAppointments, reset as resetAppointment, updateAppointmentStatus, assignTechnician } from '../redux/appointmentSlice';
import { createInvoice, getAllInvoices } from '../redux/invoiceSlice';
import { getServiceRecordByAppointment } from '../redux/serviceRecordSlice';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import './Dashboard.css';

const ServiceCenterDashboard = () => {
  const { user, usersList } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.appointment);
  const { invoices } = useSelector((state) => state.invoice);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [assignmentModal, setAssignmentModal] = useState({ isOpen: false, appointmentId: null });
  const [selectedTech, setSelectedTech] = useState('');
  
  // Invoice generation state
  const [invoiceModal, setInvoiceModal] = useState({isOpen: false, appointment: null});
  const [lineItems, setLineItems] = useState([{description: '', cost: ''}]);
  const [techNotes, setTechNotes] = useState('');

  // Polling for real-time global overview (every 10 seconds)
  useEffect(() => {
    if (user) {
      dispatch(getAllAppointments());
      dispatch(getAllInvoices()); // Pull invoices to check billed status
      dispatch(getAllUsers()); // Fetch techs
      
      const intervalId = setInterval(() => {
        dispatch(getAllAppointments());
        dispatch(getAllInvoices());
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

  const handleCancelAppt = (id) => {
    if(window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(updateAppointmentStatus({ id, status: 'Cancelled' }));
    }
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if(selectedTech && assignmentModal.appointmentId) {
       dispatch(assignTechnician({ id: assignmentModal.appointmentId, technicianId: selectedTech }));
       setAssignmentModal({ isOpen: false, appointmentId: null });
       setSelectedTech('');
    }
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if(lineItems.length === 0 || lineItems.some(i => !i.description || !i.cost)) return alert('Please fill out all line items.');
    const formattedItems = lineItems.map(i => ({ description: i.description, cost: Number(i.cost) }));
    
    // Safely extract vehicleId
    const targetVehicle = invoiceModal.appointment.vehicleId?._id || invoiceModal.appointment.vehicleId;

    await dispatch(createInvoice({
        appointmentId: invoiceModal.appointment._id,
        vehicleId: targetVehicle,
        lineItems: formattedItems
    }));
    
    // Move to definitively completed!
    await dispatch(updateAppointmentStatus({ id: invoiceModal.appointment._id, status: 'Completed' }));
    
    alert('Invoice successfully generated and sent to customer!');
    dispatch(getAllInvoices()); // Refresh global invoices array instantly
    dispatch(getAllAppointments()); // Refresh appt statuses
    setInvoiceModal({isOpen: false, appointment: null});
    setLineItems([{description: '', cost: ''}]);
    setTechNotes('');
    setActiveTab('schedule');
  };

  const openInvoiceModal = async (app) => {
    setInvoiceModal({isOpen: true, appointment: app});
    setLineItems([{description: 'Loading system data...', cost: ''}]);
    setTechNotes('Retrieving technical diagnostics...');
    try {
        const res = await dispatch(getServiceRecordByAppointment(app._id)).unwrap();
        const newItems = [];
        
        if (res && res.repairDetails) {
            setTechNotes(res.repairDetails);
            newItems.push({ description: 'Primary Service Labor', cost: '' });
        } else {
            setTechNotes('No detailed diagnostic notes were logged by the service technician.');
        }

        if (res && res.replacedParts && Array.isArray(res.replacedParts) && res.replacedParts[0] !== "") {
            res.replacedParts.forEach(p => newItems.push({ description: 'Installed Part: ' + p, cost: '' }));
        }

        if(newItems.length === 0) newItems.push({ description: 'Standard Service Charge', cost: '' });
        setLineItems(newItems);
    } catch {
        setTechNotes('Technical report inaccessible or not filed correctly.');
        setLineItems([{description: 'Standard Service Charge', cost: ''}]);
    }
  };

  const tabs = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Business Overview' },
    { id: 'schedule', icon: 'fa-calendar-alt', label: 'Master Schedule' },
    { id: 'invoices', icon: 'fa-file-invoice-dollar', label: 'Invoicing & Billing' },
  ];

  const pendingApps = appointments.filter(a => a.status === 'Booked');
  const activeApps = appointments.filter(a => a.status === 'In Progress');
  const awaitingInvoicesApps = appointments.filter(a => a.status === 'Awaiting Invoice');
  const completedApps = appointments.filter(a => a.status === 'Completed');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h1 className="heading-lg">Staff Portal, <span className="text-gradient">{user?.name}</span></h1>
                <p className="text-body mt-2">Oversee appointments, manage staff operations, and track business health.</p>
              </div>
            </div>

            <div className="dash__metrics">
              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--amber">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{pendingApps.length}</p>
                <p className="dash__metric-label">New Appointments (Unassigned)</p>
              </div>

              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--blue">
                    <i className="fas fa-cogs"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{activeApps.length}</p>
                <p className="dash__metric-label">Bays Currently Active</p>
              </div>

              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--green">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{completedApps.length}</p>
                <p className="dash__metric-label">Total Jobs Completed</p>
              </div>

              {/* Placeholder for Revenue */}
              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--purple">
                    <i className="fas fa-indian-rupee-sign"></i>
                  </div>
                </div>
                <p className="dash__metric-value">--</p>
                <p className="dash__metric-label">Est. Daily Revenue</p>
              </div>
            </div>

            <div className="dash__table-card card mt-8">
              <div className="dash__table-header">
                <h3 className="heading-sm">High Priority Alerts / Needs Attention</h3>
              </div>
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <tbody>
                    {pendingApps.length > 0 ? (
                      <tr>
                        <td className="p-6">
                            <div className="d-flex items-center gap-4">
                                <div className="dash__metric-icon dash__metric-icon--amber" style={{ width:'32px', height:'32px'}}><i className="fas fa-exclamation-triangle"></i></div>
                                <div>
                                    <strong style={{color:'var(--text-primary)'}}>{pendingApps.length} upcoming appointments are currently unassigned!</strong>
                                    <span style={{display:'block', color:'var(--text-tertiary)', fontSize:'0.75rem'}}>Navigate to Master Schedule to review routing.</span>
                                </div>
                            </div>
                        </td>
                        <td className="text-right p-6">
                            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('schedule')}>Review Queue</button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className="text-center p-8 text-secondary">
                          <i className="fas fa-check-circle mb-3" style={{ fontSize: '2rem', color: 'var(--success-color)' }}></i><br/>
                          All operations are running smoothly. No alerts.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h2 className="heading-md">Master Schedule</h2>
                <p className="text-body mt-1">View and manage all incoming service requests across the platform.</p>
              </div>
            </div>
            
            <div className="dash__table-card card">
               <div className="dash__table-wrap">
                  <table className="dash__table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Vehicle / Owner ID</th>
                        <th>Service Type</th>
                        <th>Current Status</th>
                        <th>Technician</th>
                        <th>Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(app => {
                        const relatedInvoice = invoices?.find(inv => inv.appointmentId?._id === app._id || inv.appointmentId === app._id);
                        return (
                        <tr key={app._id}>
                          <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            <strong>{app.vehicleId?.vehicleNumber || 'Unknown'}</strong>
                            <span style={{display:'block', fontSize:'11px', color:'var(--text-tertiary)'}}>{app.vehicleId?._id || 'N/A'}</span>
                          </td>
                          <td>{app.serviceType}</td>
                          <td>
                            <span className={`badge ${app.status === 'Completed' ? 'badge-success' : app.status === 'In Progress' ? 'badge-info' : app.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            {app.technicianId ? (
                                <span className="text-sm">Assigned: {app.technicianId.name}</span>
                            ) : (
                                <span className="text-secondary text-sm">Unassigned</span>
                            )}
                          </td>
                          <td>
                            {app.status === 'Booked' && (
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline btn-sm" onClick={() => setAssignmentModal({isOpen: true, appointmentId: app._id})}>Assign</button>
                                    <button className="btn btn-ghost btn-sm" style={{color: 'var(--danger-color)'}} onClick={() => handleCancelAppt(app._id)}>Cancel</button>
                                </div>
                            )}
                            {app.status === 'Awaiting Invoice' && (
                                <button className="btn btn-primary btn-sm" onClick={() => openInvoiceModal(app)}>Prepare Invoice</button>
                            )}
                            {app.status === 'Completed' && (
                                <span className="badge badge-success"><i className="fas fa-check-circle"></i> Billed</span>
                            )}
                          </td>
                        </tr>
                        )})}
                      {appointments.length === 0 && (
                        <tr><td colSpan="6" className="text-center p-6 text-secondary">No recorded appointments in the system.</td></tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        );

      case 'invoices':
        return (
            <div className="animate-fade-up">
              <div className="dash__welcome mb-8">
                <div>
                  <h2 className="heading-md">Invoicing & Billing <span className="badge badge-amber ml-2" style={{verticalAlign:'middle'}}>Beta Module</span></h2>
                  <p className="text-body mt-1">Generate receipts and log financial records. (Active development)</p>
                </div>
              </div>
              <div className="dash__empty card p-10 text-center">
                <i className="fas fa-file-invoice-dollar" style={{fontSize: '2.5rem', color: 'var(--accent-light)', marginBottom: '16px'}}></i>
                <h3 className="heading-sm mb-2">Billing System Integration</h3>
                <p className="text-body mb-4">You have <strong style={{color: 'var(--text-white)'}}>{awaitingInvoicesApps.length}</strong> service jobs waiting to be priced and billed.</p>
                <div className="d-flex justify-center gap-3">
                    <button className="btn btn-primary" onClick={() => setActiveTab('schedule')}>Go to Schedule to Bill</button>
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
            <span className="dash__sidebar-logo-text">AutoCare<span style={{color: '#f59e0b', marginLeft: '5px'}}>Staff</span></span>
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
              <i className="fas fa-user-tie" style={{color: '#f59e0b'}}></i>
            </div>
            <div className="dash__user-info">
              <strong>{user?.name || 'Administrator'}</strong>
              <span className="text-xs" style={{letterSpacing: 'normal', color: '#d97706'}}>Staff</span>
            </div>
          </div>
          <button className="btn btn-ghost w-full mt-3" onClick={onLogout} style={{justifyContent: 'flex-start', color: 'var(--text-tertiary)'}}>
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </aside>

      <main className="dash__main">
        {renderContent()}

        {/* Assignment Modal */}
        {assignmentModal.isOpen && (
            <div className="auth__split" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className="card p-8" style={{width: '400px', maxWidth: '90%'}}>
                    <h3 className="heading-sm mb-4">Assign Technician</h3>
                    <form onSubmit={handleAssign}>
                        <div className="form-group mb-4">
                            <label className="auth__input-label">Select from Staff</label>
                            <select className="auth__input auth__select" value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)} required>
                                <option value="">-- Choose Technician --</option>
                                {usersList?.filter(u => u.role === 'technician').map(tech => (
                                    <option key={tech._id} value={tech._id}>{tech.name} (Tech Level)</option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex gap-3 justify-end">
                            <button type="button" className="btn btn-ghost" onClick={() => setAssignmentModal({isOpen: false, appointmentId: null})}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Confirm Assignment</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Invoice Modal */}
        {invoiceModal.isOpen && (
            <div className="modal-backdrop" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 7, 12, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out'}}>
                <div className="card p-8 relative" style={{width: '650px', maxWidth: '95%', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)', animation: 'slideUp 0.3s ease-out'}}>
                    
                    <div className="d-flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <h3 className="heading-sm" style={{display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-file-invoice-dollar mr-3" style={{color: '#f59e0b', fontSize: '1.25rem'}}></i>
                            Official Billing Generation
                        </h3>
                        <button className="btn btn-ghost" style={{padding: '0.5rem', width: '32px', height: '32px', borderRadius: '50%', color: 'var(--text-tertiary)'}} onClick={() => { setInvoiceModal({isOpen: false, appointment: null}); setLineItems([{description:'', cost:''}]); setTechNotes(''); }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleGenerateInvoice}>
                        
                        <div className="mb-6 p-4 rounded" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'}}>
                            <label className="text-xs mb-2 d-block" style={{color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                               <i className="fas fa-tools mr-1"></i> Technician's Repair Notes
                            </label>
                            <p className="text-secondary text-sm m-0" style={{lineHeight: '1.5'}}>
                                {techNotes}
                            </p>
                        </div>

                        <label className="text-xs mb-3 d-block" style={{color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                           Itemized Billing Formulation
                        </label>

                        <div className="line-items mb-5" style={{maxHeight:'220px', overflowY:'auto', paddingRight: '8px'}}>
                            {lineItems.map((item, idx) => (
                                <div key={idx} className="d-flex gap-2 mb-3 items-center">
                                    <div className="dash__metric-icon" style={{width: '28px', height: '28px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'}}>
                                        {idx + 1}
                                    </div>
                                    <input type="text" className="auth__input m-0" placeholder="Part / Labor Classification" value={item.description} onChange={(e) => {
                                        const newItems = [...lineItems];
                                        newItems[idx].description = e.target.value;
                                        setLineItems(newItems);
                                    }} required style={{flex: 2, background: 'rgba(255,255,255,0.03)'}}/>
                                    <div className="relative" style={{flex: 1}}>
                                        <span style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)'}}>₹</span>
                                        <input type="number" className="auth__input m-0" min="1" placeholder="Cost" value={item.cost} onChange={(e) => {
                                            const newItems = [...lineItems];
                                            newItems[idx].cost = e.target.value;
                                            setLineItems(newItems);
                                        }} required style={{background: 'rgba(255,255,255,0.03)', paddingLeft: '28px'}}/>
                                    </div>
                                    {lineItems.length > 1 && (
                                        <button type="button" className="btn btn-ghost" style={{padding: '0', width: '40px', height: '40px', display: 'flex', alignItems:'center', justifyContent:'center'}} onClick={() => {
                                            setLineItems(lineItems.filter((_, i) => i !== idx));
                                        }}>
                                            <i className="fas fa-times-circle text-danger"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-between items-center mb-6 px-2">
                            <button type="button" className="btn btn-outline btn-sm" style={{borderColor: 'rgba(255,255,255,0.1)'}} onClick={() => setLineItems([...lineItems, {description: '', cost: ''}])}>
                                <i className="fas fa-plus mr-2"></i> Add Extra Item
                            </button>
                            <div className="heading-md" style={{color: '#f59e0b'}}>
                                Total: <span style={{color: 'var(--text-primary)'}}>₹{lineItems.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="d-flex gap-3 justify-end pt-5" style={{borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                            <button type="button" className="btn btn-outline" onClick={() => { setInvoiceModal({isOpen: false, appointment: null}); setLineItems([{description:'', cost:''}]); setTechNotes(''); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{background: '#f59e0b', color: '#111827', fontWeight: 'bold', border: 'none'}}>
                                <i className="fas fa-file-signature mr-2"></i> Dispatch Invoice
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

export default ServiceCenterDashboard;
