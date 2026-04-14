import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset as resetAuth, getAllUsers, updateUserRole, deleteUser } from '../redux/authSlice';
import { getAllAppointments, deleteAppointment, reset as resetAppt } from '../redux/appointmentSlice';
import { getAllInvoices, reset as resetInvoice, deleteInvoice } from '../redux/invoiceSlice';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import logoImg from '../assets/logo.png';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, usersList } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.appointment);
  const { invoices } = useSelector((state) => state.invoice);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [viewReceipt, setViewReceipt] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null });

  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(getAllUsers());
      dispatch(getAllAppointments());
      dispatch(getAllInvoices());
      
      const intervalId = setInterval(() => {
        dispatch(getAllUsers());
        dispatch(getAllAppointments());
        dispatch(getAllInvoices());
      }, 15000); // God-mode 15s heartbeat
      
      return () => clearInterval(intervalId);
    }
  }, [user, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetAuth());
    dispatch(resetAppt());
    dispatch(resetInvoice());
    navigate('/');
  };

  const tabs = [
    { id: 'users', icon: 'fa-users-cog', label: 'Identity Matrix' },
    { id: 'appointments', icon: 'fa-calendar-alt', label: 'God View Schedule' },
    { id: 'treasury', icon: 'fa-vault', label: 'Global Treasury' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h1 className="heading-lg">Super Admin, <span className="text-gradient">{user?.name}</span></h1>
                <p className="text-body mt-2">Manage all registered entities on the AutoCare platform.</p>
              </div>
            </div>

            <div className="dash__table-card card mt-8">
              <div className="dash__table-header">
                <h3 className="heading-sm">Global User Directory</h3>
              </div>
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Account ID</th>
                      <th>Registered Name</th>
                      <th>Email Address</th>
                      <th>System Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                        <tr key={u._id}>
                            <td className="text-sm text-secondary" style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{u._id}</td>
                            <td><strong>{u.name}</strong></td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'technician' ? 'badge-info' : 'badge-amber'}`} style={{textTransform: 'capitalize'}}>{u.role === 'service_center' ? 'Staff' : u.role}</span>
                            </td>
                            <td>
                                <div className="d-flex items-center gap-2">
                                  <span className="badge badge-secondary" title="Core roles cannot be mutated directly">Locked</span>
                                  <button className="btn btn-ghost btn-sm" style={{color: 'var(--danger-color)'}} onClick={() => {
                                      setConfirmDialog({
                                          isOpen: true,
                                          title: 'Obliterate Matrix Identity',
                                          message: 'WARNING: PERMANENTLY OBLITERATE USER? This will destroy their identity and all associated meta-data.',
                                          action: () => {
                                              dispatch(deleteUser(u._id))
                                                  .unwrap()
                                                  .then(() => { toast.success('Obliteration complete.'); dispatch(getAllUsers()); })
                                                  .catch((err) => toast.error(`Obliteration failed: ${err}`));
                                          }
                                      });
                                  }}>
                                    <i className="fas fa-trash-alt mr-1"></i> Obliterate
                                  </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {usersList.length === 0 && (
                        <tr><td colSpan="5" className="text-center p-8">No users active.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'appointments':
         return (
          <div className="animate-fade-up">
            <div className="dash__table-card card">
              <div className="dash__table-header">
                <h3 className="heading-sm">Global Master Schedule Override</h3>
              </div>
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Registered Vehicle</th>
                      <th>Service Type</th>
                      <th>Status (Assigned To)</th>
                      <th>God Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                        <tr key={app._id}>
                          <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            <strong>{app.vehicleId?.vehicleNumber || 'Unknown'}</strong>
                            <span style={{display:'block', fontSize:'11px', color:'var(--text-tertiary)'}}>{app.vehicleId?._id || 'N/A'}</span>
                          </td>
                          <td>{app.serviceType}</td>
                          <td>
                                <span className={`badge ${app.status === 'Completed' ? 'badge-success' : app.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>{app.status}</span>
                                <span className="text-sm ms-2 text-secondary">{app.technicianId ? `(${app.technicianId.name})` : '(Unassigned)'}</span>
                            </td>
                            <td>
                                <button className="btn btn-outline btn-sm" style={{color: 'var(--danger-color)', borderColor: 'var(--danger-color)'}} onClick={() => {
                                    setConfirmDialog({
                                        isOpen: true,
                                        title: 'Force Delete Schedule',
                                        message: 'FORCE DELETE this appointment off the system? This action cannot be reversed.',
                                        action: () => {
                                            dispatch(deleteAppointment(app._id))
                                                .unwrap()
                                                .then(() => { toast.success('Appointment force deleted.'); dispatch(getAllAppointments()); })
                                                .catch((err) => toast.error(`Error force deleting: ${err}`));
                                        }
                                    });
                                }}>
                                  <i className="fas fa-eraser mr-1"></i> Force Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
         );

      case 'treasury':
         // Calculate Treasury
         const totalPaid = invoices.filter(i => i.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
         const totalPending = invoices.filter(i => i.paymentStatus === 'Pending').reduce((acc, curr) => acc + curr.totalAmount, 0);

         return (
             <div className="animate-fade-up">
                <h2 className="heading-md mb-6">Global Financial Master</h2>
                <div className="dash__metrics mb-8" style={{display: 'flex', gap: '1.5rem'}}>
                    <div className="dash__metric card" style={{flex: 1, borderTop: '4px solid var(--success-color)'}}>
                        <p className="dash__metric-value text-gradient">₹{totalPaid.toLocaleString('en-IN')}</p>
                        <p className="dash__metric-label">Secured Liquid Revenue</p>
                    </div>
                    <div className="dash__metric card" style={{flex: 1, borderTop: '4px solid var(--primary-accent)'}}>
                        <p className="dash__metric-value">₹{totalPending.toLocaleString('en-IN')}</p>
                        <p className="dash__metric-label">Outstanding Balances</p>
                    </div>
                </div>

                <div className="dash__table-card card">
                    <div className="dash__table-header">
                        <h3 className="heading-sm">Global Invoice Ledger</h3>
                    </div>
                    <div className="dash__table-wrap">
                        <table className="dash__table">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Billed To</th>
                                    <th>Total Charge</th>
                                    <th>Billing Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(inv => {
                                    let ownerName = 'Unknown User';
                                    if (inv.vehicleId && inv.vehicleId.userId) {
                                        const matched = usersList.find(u => u._id === inv.vehicleId.userId);
                                        if (matched) ownerName = matched.name;
                                    }
                                    return (
                                    <tr key={inv._id}>
                                        <td className="text-sm text-secondary" style={{maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{inv._id}</td>
                                        <td><strong>{ownerName}</strong></td>
                                        <td><strong>₹{inv.totalAmount.toLocaleString('en-IN')}</strong></td>
                                        <td>
                                            <span className={`badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{inv.paymentStatus}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-outline btn-sm" onClick={() => setViewReceipt(inv)}>
                                                  <i className="fas fa-eye mr-1"></i> Details
                                                </button>
                                                <button className="btn btn-ghost btn-sm" style={{color: 'var(--danger-color)'}} onClick={() => {
                                                    setConfirmDialog({
                                                        isOpen: true,
                                                        title: 'Obliterate Treasury Record',
                                                        message: 'OBLITERATE this invoice record forever? This voids all financial history for this transaction.',
                                                        action: () => {
                                                            dispatch(deleteInvoice(inv._id))
                                                                .unwrap()
                                                                .then(() => { toast.success('Invoice obliterated.'); dispatch(getAllInvoices()); })
                                                                .catch((err) => toast.error(`Error obliterating invoice: ${err}`));
                                                        }
                                                    });
                                                }}>
                                                  <i className="fas fa-trash mr-1"></i> Obliterate
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )})}
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
            <span className="dash__sidebar-logo-text">AutoCare<span style={{color: '#ef4444', marginLeft: '5px'}}>Root</span></span>
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
          <button className="btn btn-ghost w-full mt-3" onClick={onLogout} style={{justifyContent: 'flex-start', color: 'var(--text-tertiary)'}}>
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </aside>

      <main className="dash__main">
        {renderContent()}

        {viewReceipt && (() => {
          const relatedApp = viewReceipt.appointmentId;
          const relatedVehicle = viewReceipt.vehicleId;
          const grandTotal = viewReceipt.totalAmount;
          const subtotal = Math.round(grandTotal / 1.18);
          const taxAmount = grandTotal - subtotal;
          
          let ownerName = 'Unknown User';
          let ownerEmail = '';
          let relatedOwner = null;
          if (relatedVehicle && relatedVehicle.userId) {
              relatedOwner = usersList.find(u => u._id === relatedVehicle.userId);
          }

          const downloadPDF = () => {
            try {
                const doc = new jsPDF({ unit: 'mm', format: 'a4' });
                const w = doc.internal.pageSize.getWidth();
                const safeId = viewReceipt._id ? String(viewReceipt._id).slice(-8).toUpperCase() : 'REC';
                const fName = `AutoCare_Invoice_${safeId}.pdf`;

                const compTotal = Number(grandTotal) || 0;
                const compSub = Number(subtotal) || 0;
                const compTax = Number(taxAmount) || 0;

                // Header Background
                doc.setFillColor(3, 7, 18);
                doc.rect(0, 0, w, 45, 'F');
                doc.setTextColor(255, 255, 255);
                
                // Native Vector Company Logo (No external image loading required)
                doc.setFillColor(16, 185, 129); // Premium Green
                doc.roundedRect(18, 17, 10, 10, 2, 2, 'F');
                doc.setFillColor(255, 255, 255);
                doc.circle(23, 22, 3, 'F');
                doc.setFillColor(3, 7, 18);
                doc.circle(23, 22, 1.5, 'F');

                doc.setFontSize(22);
                doc.setFont('helvetica', 'bold');
                doc.text('AutoCare', 32, 25);

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text('Premium Vehicle Service Management', 32, 33);
                
                doc.setFontSize(20);
                doc.text('INVOICE', w - 20, 25, { align: 'right' });
                doc.setFontSize(9);
                doc.text(`#${safeId}`, w - 20, 33, { align: 'right' });

                // Invoice meta
                doc.setTextColor(30, 30, 30);
                let y = 60;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Bill To:', 20, y);
                doc.text('Invoice Details:', w - 80, y);
                doc.setFont('helvetica', 'normal');
                y += 6;
                doc.text(String(relatedOwner?.name || 'Customer'), 20, y);
                doc.text(`Date: ${new Date(viewReceipt.createdAt).toLocaleDateString('en-IN')}`, w - 80, y);
                y += 5;
                doc.text(String(relatedOwner?.email || ''), 20, y);
                doc.text(`Status: ${viewReceipt.paymentStatus}`, w - 80, y);
                y += 5;
                if (relatedVehicle) {
                  doc.text(`Vehicle: ${relatedVehicle.vehicleNumber} (${relatedVehicle.model})`, 20, y);
                }
                if (relatedApp) {
                  doc.text(`Service: ${relatedApp.serviceType}`, w - 80, y);
                }

                // Table header
                y += 15;
                doc.setFillColor(243, 244, 246);
                doc.rect(20, y - 5, w - 40, 10, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.text('#', 25, y);
                doc.text('Description', 35, y);
                doc.text('Amount', w - 25, y, { align: 'right' });

                // Items
                doc.setFont('helvetica', 'normal');
                y += 10;
                if (viewReceipt.lineItems && viewReceipt.lineItems.length > 0) {
                  viewReceipt.lineItems.forEach((item, idx) => {
                    doc.text(`${idx + 1}`, 25, y);
                    doc.text(String(item.description), 35, y);
                    doc.text(`Rs. ${Number(item.cost || 0).toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });
                    y += 8;
                  });
                } else {
                  doc.text('1', 25, y);
                  doc.text('Vehicle Service', 35, y);
                  doc.text(`Rs. ${compTotal.toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });
                  y += 8;
                }

                // Totals
                y += 5;
                doc.line(w - 80, y, w - 20, y);
                y += 8;
                doc.text('Subtotal:', w - 80, y);
                doc.text(`Rs. ${compSub.toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });
                y += 7;
                doc.text('GST (18%):', w - 80, y);
                doc.text(`Rs. ${compTax.toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });
                y += 7;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text('Total:', w - 80, y);
                doc.text(`Rs. ${compTotal.toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });

                // Footer
                y += 20;
                doc.setDrawColor(200);
                doc.line(20, y, w - 20, y);
                y += 8;
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(120);
                doc.text('Thank you for choosing AutoCare. This is a computer-generated invoice.', w / 2, y, { align: 'center' });
                doc.text('Amaravati, Andhra Pradesh | support@autocare.in | +91-XXXX-XXXXXX', w / 2, y + 5, { align: 'center' });

                doc.save(fName);
            } catch (err) {
                console.error("PDF Generation Error: ", err);
                toast.error("Failed to render PDF. Please ensure your browser supports blob downloads.");
            }
          };

          return (
            <div className="receipt-overlay" onClick={(e) => e.target.className === 'receipt-overlay' && setViewReceipt(null)}>
              <div className="receipt-modal card animate-fade-up">
                {/* Header */}
                <div className="receipt-header">
                  <div className="receipt-header__brand">
                    <div className="receipt-header__logo">
                      <img src={logoImg} alt="AutoCare" style={{width: '22px', filter: 'invert(1)'}} />
                    </div>
                    <div>
                      <h2 className="receipt-header__title">AutoCare</h2>
                      <p className="receipt-header__subtitle">Premium Vehicle Service</p>
                    </div>
                  </div>
                  <div className="receipt-header__meta">
                    <span className="receipt-header__invoice-label">INVOICE</span>
                    <span className="receipt-header__invoice-id">#{viewReceipt._id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>

                {/* Info row */}
                <div className="receipt-info">
                  <div className="receipt-info__block">
                    <span className="receipt-info__label">Billed To</span>
                    <strong className="receipt-info__value">{ownerName}</strong>
                    <span className="receipt-info__detail">{ownerEmail}</span>
                  </div>
                  <div className="receipt-info__block">
                    <span className="receipt-info__label">Vehicle</span>
                    <strong className="receipt-info__value">{relatedVehicle ? relatedVehicle.vehicleNumber : 'N/A'}</strong>
                    <span className="receipt-info__detail">{relatedVehicle ? relatedVehicle.model : ''}</span>
                  </div>
                  <div className="receipt-info__block">
                    <span className="receipt-info__label">Date</span>
                    <strong className="receipt-info__value">{new Date(viewReceipt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                    <span className="receipt-info__detail">{relatedApp?.serviceType || 'Service'}</span>
                  </div>
                  <div className="receipt-info__block receipt-info__block--status">
                    <span className="receipt-info__label">Status</span>
                    <span className={`badge ${viewReceipt.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      <i className={`fas ${viewReceipt.paymentStatus === 'Paid' ? 'fa-check-circle' : 'fa-clock'}`} style={{marginRight: '4px'}}></i>
                      {viewReceipt.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="receipt-items">
                  <div className="receipt-items__header">
                    <span>#</span>
                    <span>Description</span>
                    <span style={{textAlign: 'right'}}>Amount</span>
                  </div>
                  {viewReceipt.lineItems && viewReceipt.lineItems.length > 0 ? (
                    viewReceipt.lineItems.map((item, idx) => (
                      <div key={idx} className="receipt-items__row">
                        <span className="receipt-items__num">{idx + 1}</span>
                        <span className="receipt-items__desc">{item.description}</span>
                        <span className="receipt-items__cost">₹{item.cost.toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="receipt-items__row">
                      <span className="receipt-items__num">1</span>
                      <span className="receipt-items__desc">{relatedApp?.serviceType || 'Vehicle Service'}</span>
                      <span className="receipt-items__cost">₹{viewReceipt.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="receipt-totals">
                  <div className="receipt-totals__row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="receipt-totals__row">
                    <span>GST (18%)</span>
                    <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="receipt-totals__row receipt-totals__row--grand">
                    <span>Total Amount</span>
                    <span className="text-gradient">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="receipt-footer">
                  <p className="receipt-footer__note">
                    <i className="fas fa-shield-alt"></i> This is a computer-generated invoice from AutoCare, Amaravati, AP.
                  </p>
                  <div className="receipt-footer__actions">
                    <button className="btn btn-outline btn-sm" onClick={downloadPDF}>
                      <i className="fas fa-download mr-2"></i> Download Invoice
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setViewReceipt(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {/* Confirmation Modal */}
        {confirmDialog.isOpen && (
          <div className="modal-overlay" style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(3, 7, 18, 0.65)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 9999 
          }}>
            <div className="modal-content animate-fade-up" style={{ 
              maxWidth: '400px', 
              width: '90%',
              textAlign: 'center', 
              padding: '0', 
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ background: 'var(--danger-color)', padding: '24px 20px', color: 'white' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '40px', marginBottom: '10px', display: 'block' }}></i>
                <h3 className="heading-sm" style={{ color: 'white', margin: 0 }}>{confirmDialog.title}</h3>
              </div>
              <div style={{ padding: '24px 20px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderTop: 'none' }}>
                <p className="text-secondary mb-6">{confirmDialog.message}</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-outline" style={{flex: 1}} onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} onClick={() => {
                      if(confirmDialog.action) confirmDialog.action();
                      setConfirmDialog({...confirmDialog, isOpen: false});
                  }}>
                    Execute
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
