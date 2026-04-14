import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset as resetAuth } from '../redux/authSlice';
import { getVehicles, addVehicle, reset as resetVehicle } from '../redux/vehicleSlice';
import { getAppointments, createAppointment, reset as resetAppointment } from '../redux/appointmentSlice';
import { getMyInvoices, payInvoice, reset as resetInvoice } from '../redux/invoiceSlice';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import logoImg from '../assets/logo.png';
import './Dashboard.css';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true); return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { vehicles, isLoading: vehiclesLoading } = useSelector((state) => state.vehicle);
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointment);
  const { invoices } = useSelector((state) => state.invoice);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [viewReceipt, setViewReceipt] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [razorpayMock, setRazorpayMock] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ cardNum: '', expiry: '', cvv: '', upiId: '', bank: 'SBI - State Bank of India' });
  const [paymentError, setPaymentError] = useState('');

  // Form states
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehicleData, setVehicleData] = useState({ vehicleNumber: '', model: '', fuelType: 'Petrol', purchaseYear: '' });
  
  const [showApptForm, setShowApptForm] = useState(false);
  const [apptData, setApptData] = useState({ vehicleId: '', serviceType: 'General Service', appointmentDate: '' });

  // Polling for real-time updates (every 15 seconds)
  useEffect(() => {
    if (user) {
      dispatch(getVehicles());
      dispatch(getAppointments());
      dispatch(getMyInvoices()); // Pull customer bills
      
      const intervalId = setInterval(() => {
        dispatch(getAppointments());
        dispatch(getMyInvoices());
      }, 15000); // 15 seconds polling

      return () => clearInterval(intervalId);
    }
  }, [user, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetAuth());
    dispatch(resetVehicle());
    dispatch(resetAppointment());
    dispatch(resetInvoice());
    navigate('/');
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    dispatch(addVehicle(vehicleData));
    setVehicleData({ vehicleNumber: '', model: '', fuelType: 'Petrol', purchaseYear: '' });
    setShowVehicleForm(false);
  };

  const handleBookAppt = (e) => {
    e.preventDefault();
    dispatch(createAppointment(apptData));
    setApptData({ vehicleId: '', serviceType: 'General Service', appointmentDate: '' });
    setShowApptForm(false);
    setActiveTab('overview');
  };

  const handleRazorpayCheckout = async (invoice) => {
    try {
      const { data: order } = await axios.post(`http://localhost:5000/api/invoices/${invoice._id}/create-razorpay-order`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setPaymentForm({ cardNum: '', expiry: '', cvv: '', upiId: '', bank: 'SBI - State Bank of India' });
      setPaymentError('');
      
      setRazorpayMock({
          isOpen: true,
          amount: order.amount / 100, // Converting paise back to INR
          invoice: invoice,
          orderId: order.id,
          selectedMode: null
      });

    } catch (e) {
      toast.error('Failed to initialize payment gateway. Check server connection.');
      console.error(e);
    }
  };

  const tabs = [
    { id: 'overview', icon: 'fa-grip-horizontal', label: 'Overview' },
    { id: 'vehicles', icon: 'fa-car', label: 'My Vehicles' },
    { id: 'appointments', icon: 'fa-calendar-check', label: 'Appointments' },
    { id: 'history', icon: 'fa-clock-rotate-left', label: 'Service History' },
  ];

  const pendingApps = appointments.filter(a => a.status === 'Booked' || a.status === 'In Progress');
  const completedApps = appointments.filter(a => a.status === 'Completed' || a.status === 'Awaiting Invoice');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h1 className="heading-lg">Welcome back, <span className="text-gradient">{user?.name}</span></h1>
                <p className="text-body mt-2">Here's a summary of your vehicle service activity.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveTab('appointments')}>
                <i className="fas fa-plus"></i> Book Service
              </button>
            </div>

            <div className="dash__metrics">
              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--blue">
                    <i className="fas fa-car"></i>
                  </div>
                  <span className="badge badge-info">Active</span>
                </div>
                <p className="dash__metric-value">{vehicles.length}</p>
                <p className="dash__metric-label">Registered Vehicles</p>
              </div>

              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--amber">
                    <i className="fas fa-wrench"></i>
                  </div>
                  {pendingApps.length > 0 && <span className="badge badge-warning">Pending</span>}
                </div>
                <p className="dash__metric-value">{pendingApps.length}</p>
                <p className="dash__metric-label">Active Services</p>
              </div>

              <div className="dash__metric card">
                <div className="dash__metric-top">
                  <div className="dash__metric-icon dash__metric-icon--green">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
                <p className="dash__metric-value">{completedApps.length}</p>
                <p className="dash__metric-label">Completed Services</p>
              </div>
            </div>

            <div className="dash__table-card card mt-8">
              <div className="dash__table-header">
                <h3 className="heading-sm">Recent Service Activity</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('history')}>
                  View all <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Service Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map(app => {
                      const veh = (app.vehicleId && typeof app.vehicleId === 'object') ? app.vehicleId : vehicles.find(v => v._id === app.vehicleId);
                      return (
                        <tr key={app._id}>
                          <td>
                            <div className="dash__vehicle-cell">
                              <div className="dash__vehicle-icon"><i className="fas fa-car"></i></div>
                              <div>
                                <strong>{veh ? veh.vehicleNumber : 'Unknown'}</strong>
                                <span>{veh ? veh.model : ''}</span>
                              </div>
                            </div>
                          </td>
                          <td>{app.serviceType}</td>
                          <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${app.status === 'Completed' ? 'badge-success' : app.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center p-4">No recent activity.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'vehicles':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h2 className="heading-md">My Vehicles</h2>
                <p className="text-body mt-1">Manage your registered vehicles.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowVehicleForm(!showVehicleForm)}>
                <i className={`fas ${showVehicleForm ? 'fa-times' : 'fa-plus'}`}></i> {showVehicleForm ? 'Cancel' : 'Add Vehicle'}
              </button>
            </div>

            {showVehicleForm && (
              <div className="card p-6 mb-8" style={{ border: '1px solid var(--accent)' }}>
                <h3 className="heading-sm mb-4">Add New Vehicle</h3>
                <form onSubmit={handleAddVehicle} className="d-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Registration Number</label>
                    <input type="text" className="form-control" name="vehicleNumber" value={vehicleData.vehicleNumber} onChange={(e) => setVehicleData({...vehicleData, vehicleNumber: e.target.value})} placeholder="e.g. MH12AB1234" required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Model</label>
                    <input type="text" className="form-control" name="model" value={vehicleData.model} onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})} placeholder="e.g. Honda City" required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Fuel Type</label>
                    <select className="form-control" name="fuelType" value={vehicleData.fuelType} onChange={(e) => setVehicleData({...vehicleData, fuelType: e.target.value})}>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Purchase Year</label>
                    <input type="number" className="form-control" name="purchaseYear" value={vehicleData.purchaseYear} onChange={(e) => setVehicleData({...vehicleData, purchaseYear: e.target.value})} placeholder="e.g. 2020" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className="btn btn-primary w-full">Save Vehicle</button>
                  </div>
                </form>
              </div>
            )}

            <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {vehicles.map(vehicle => (
                <div key={vehicle._id} className="card p-6">
                  <div className="d-flex items-center gap-4 mb-4">
                     <div className="dash__metric-icon dash__metric-icon--blue"><i className="fas fa-car-side"></i></div>
                     <div>
                       <h3 className="heading-sm">{vehicle.vehicleNumber}</h3>
                       <p className="text-sm">{vehicle.model}</p>
                     </div>
                  </div>
                  <div className="d-flex justify-between text-sm">
                    <span className="text-secondary">Fuel: {vehicle.fuelType}</span>
                    <span className="text-secondary">Year: {vehicle.purchaseYear || 'N/A'}</span>
                  </div>
                </div>
              ))}
              {vehicles.length === 0 && !showVehicleForm && (
                <div className="dash__empty card p-10 text-center w-full" style={{ gridColumn: '1 / -1' }}>
                  <i className="fas fa-car-side" style={{fontSize: '2.5rem', color: 'var(--text-tertiary)', marginBottom: '16px'}}></i>
                  <p className="text-body">Your registered vehicles will appear here.</p>
                  <button className="btn btn-outline mt-4" onClick={() => setShowVehicleForm(true)}>Add Your First Vehicle</button>
                </div>
              )}
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h2 className="heading-md">Book Appointment</h2>
                <p className="text-body mt-1">Schedule your next vehicle service online.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowApptForm(!showApptForm)}>
                <i className={`fas ${showApptForm ? 'fa-times' : 'fa-calendar-plus'}`}></i> {showApptForm ? 'Cancel' : 'New Booking'}
              </button>
            </div>

            {showApptForm ? (
               <div className="card p-6 mb-8" style={{ border: '1px solid var(--accent)' }}>
                 <h3 className="heading-sm mb-4">Service Details</h3>
                 {vehicles.length === 0 ? (
                   <div className="p-4 bg-yellow-900/20 text-yellow-500 rounded-md">
                     You must add a vehicle first before booking an appointment.
                   </div>
                 ) : (
                   <form onSubmit={handleBookAppt} className="d-grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                     <div className="form-group mb-0">
                       <label className="form-label">Select Vehicle</label>
                       <select className="form-control" required value={apptData.vehicleId} onChange={(e) => setApptData({...apptData, vehicleId: e.target.value})}>
                         <option value="">-- Choose Vehicle --</option>
                         {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNumber} - {v.model}</option>)}
                       </select>
                     </div>
                     <div className="form-group mb-0">
                       <label className="form-label">Service Type</label>
                       <select className="form-control" value={apptData.serviceType} onChange={(e) => setApptData({...apptData, serviceType: e.target.value})}>
                         <option value="General Service">General Service</option>
                         <option value="Oil Change">Oil Change</option>
                         <option value="Brake Inspection">Brake Inspection</option>
                         <option value="Tire Alignment">Tire Alignment</option>
                         <option value="Engine Diagnostics">Engine Diagnostics</option>
                       </select>
                     </div>
                     <div className="form-group mb-0">
                       <label className="form-label">Preferred Date</label>
                       <input type="date" className="form-control" required value={apptData.appointmentDate} onChange={(e) => setApptData({...apptData, appointmentDate: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                     </div>
                     <button type="submit" className="btn btn-primary">Confirm Booking</button>
                   </form>
                 )}
               </div>
            ) : (
                <div className="dash__empty card p-10 text-center">
                  <i className="fas fa-calendar" style={{fontSize: '2.5rem', color: 'var(--text-tertiary)', marginBottom: '16px'}}></i>
                  <h3 className="heading-sm mb-2">Schedule a Service</h3>
                  <p className="text-body mb-4">You have {pendingApps.length} active bookings.</p>
                  <button className="btn btn-outline" onClick={() => setShowApptForm(true)}>Book Now</button>
                </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="animate-fade-up">
            <div className="dash__welcome mb-8">
              <div>
                <h2 className="heading-md">Service History</h2>
                <p className="text-body mt-1">Complete log of your vehicle's maintenance.</p>
              </div>
            </div>
            <div className="dash__table-card card">
               <div className="dash__table-wrap">
                  <table className="dash__table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Vehicle</th>
                        <th>Service Type</th>
                        <th>Status</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.filter(a => a.status === 'Completed' || a.status === 'Awaiting Invoice').map(app => {
                        const veh = (app.vehicleId && typeof app.vehicleId === 'object') ? app.vehicleId : vehicles.find(v => v._id === app.vehicleId);
                        const relatedInvoice = invoices.find(inv => inv.appointmentId?._id === app._id || inv.appointmentId === app._id);
                        
                        return (
                          <tr key={app._id}>
                            <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                            <td>{veh ? `${veh.vehicleNumber} (${veh.model})` : 'Unknown'}</td>
                            <td>{app.serviceType}</td>
                            <td>
                                <span className={`badge ${app.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                                    {app.status === 'Awaiting Invoice' ? 'Service Done' : app.status}
                                </span>
                            </td>
                            <td>
                                {relatedInvoice ? (
                                    relatedInvoice.paymentStatus === 'Paid' ? (
                                        <button className="btn btn-outline btn-sm" onClick={() => setViewReceipt(relatedInvoice)}>
                                            <i className="fas fa-file-invoice mr-2"></i> View Receipt
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleRazorpayCheckout(relatedInvoice)}>
                                            Pay ₹{relatedInvoice.totalAmount.toLocaleString('en-IN')}
                                        </button>
                                    )
                                ) : (
                                    <span className="text-secondary text-sm">Generating Bill...</span>
                                )}
                            </td>
                          </tr>
                        );
                      })}
                      {appointments.filter(a => a.status === 'Completed' || a.status === 'Awaiting Invoice').length === 0 && (
                        <tr><td colSpan="5" className="text-center p-6 text-secondary">No service history found.</td></tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        );

      default:
        return <div>Working...</div>;
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
            <span className="dash__sidebar-logo-text">Auto<span className="text-gradient">Care</span></span>
          </div>

          <nav className="dash__nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`dash__nav-item ${activeTab === tab.id ? 'dash__nav-item--active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setShowApptForm(false); setShowVehicleForm(false); }}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dash__sidebar-bottom">
          <div className="dash__user-card">
            <div className="dash__user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="dash__user-info">
              <strong>{user?.name || 'User'}</strong>
              <span className="text-xs" style={{textTransform: 'capitalize', letterSpacing: 'normal'}}>{user?.role || 'Customer'}</span>
            </div>
          </div>
          <button className="btn btn-ghost w-full mt-3" onClick={onLogout} style={{justifyContent: 'flex-start', color: 'var(--text-tertiary)'}}>
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </aside>

      <main className="dash__main">
        {renderContent()}

        {viewReceipt && (() => {
          const relatedApp = appointments.find(a => a._id === (viewReceipt.appointmentId?._id || viewReceipt.appointmentId));
          const relatedVehicle = relatedApp ? 
            ((relatedApp.vehicleId && typeof relatedApp.vehicleId === 'object') ? relatedApp.vehicleId : vehicles.find(v => v._id === relatedApp.vehicleId)) 
            : null;
          const grandTotal = viewReceipt.totalAmount;
          const subtotal = Math.round(grandTotal / 1.18);
          const taxAmount = grandTotal - subtotal;

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
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(24);
                doc.text('AutoCare', 20, 25);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Premium Vehicle Service Management', 20, 32);

                doc.setFontSize(28);
                doc.setFont('helvetica', 'bold');
                doc.text('INVOICE', w - 20, 28, { align: 'right' });

                // Invoice Meta Card
                doc.setTextColor(40, 40, 40);
                let y = 55;
                
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('BILL TO:', 20, y);
                doc.text('INVOICE DETAILS:', w - 80, y);
                
                doc.setFont('helvetica', 'normal');
                y += 6;
                doc.text(String(user?.name || 'Customer'), 20, y);
                doc.text(`Invoice No: #${safeId}`, w - 80, y);
                y += 5;
                doc.text(String(user?.email || ''), 20, y);
                doc.text(`Date: ${new Date(viewReceipt.createdAt).toLocaleDateString('en-IN')}`, w - 80, y);
                y += 5;
                if (relatedVehicle) doc.text(`Vehicle: ${relatedVehicle.vehicleNumber} (${relatedVehicle.model})`, 20, y);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(viewReceipt.paymentStatus === 'Paid' ? 16 : 220, viewReceipt.paymentStatus === 'Paid' ? 185 : 38, viewReceipt.paymentStatus === 'Paid' ? 129 : 38);
                doc.text(`Status: ${viewReceipt.paymentStatus.toUpperCase()}`, w - 80, y);

                // Grid Table Header
                y += 15;
                doc.setFillColor(248, 250, 252);
                doc.setDrawColor(226, 232, 240);
                doc.rect(20, y - 6, w - 40, 12, 'FD');
                doc.setTextColor(100, 116, 139);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.text('ITEM', 25, y+2);
                doc.text('DESCRIPTION', 45, y+2);
                doc.text('AMOUNT', w - 25, y+2, { align: 'right' });

                // Grid Items
                doc.setTextColor(51, 65, 85);
                doc.setFont('helvetica', 'normal');
                y += 15;
                
                if (viewReceipt.lineItems && viewReceipt.lineItems.length > 0) {
                    viewReceipt.lineItems.forEach((item, idx) => {
                        doc.text(`0${idx + 1}`, 25, y);
                        doc.text(String(item.description), 45, y);
                        doc.text(`Rs. ${Number(item.cost || 0).toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });
                        y += 10;
                        doc.setDrawColor(241, 245, 249);
                        doc.line(20, y-5, w-20, y-5);
                    });
                } else {
                    doc.text('01', 25, y);
                    doc.text(relatedApp?.serviceType || 'Vehicle Service', 45, y);
                    doc.text(`Rs. ${compTotal.toLocaleString('en-IN')}`, w - 25, y, { align: 'right' });
                    y += 10;
                }

                // Totals Block
                y += 5;
                doc.setFillColor(248, 250, 252);
                doc.rect(w - 90, y, 70, 35, 'F');
                y += 10;
                doc.setFontSize(10);
                doc.text('Subtotal:', w - 85, y);
                doc.text(`Rs. ${compSub.toLocaleString('en-IN', {minimumFractionDigits:2})}`, w - 25, y, { align: 'right' });
                y += 8;
                doc.text('GST (18%):', w - 85, y);
                doc.text(`Rs. ${compTax.toLocaleString('en-IN', {minimumFractionDigits:2})}`, w - 25, y, { align: 'right' });
                y += 10;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.setTextColor(15, 23, 42);
                doc.text('Total:', w - 85, y);
                doc.text(`Rs. ${compTotal.toLocaleString('en-IN', {minimumFractionDigits:2})}`, w - 25, y, { align: 'right' });

                // Footer
                doc.setDrawColor(226, 232, 240);
                doc.line(20, 270, w - 20, 270);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(148, 163, 184);
                doc.text('This is a computer-generated invoice and does not require a physical signature.', w / 2, 276, { align: 'center' });
                doc.text('AutoCare Services Pvt. Ltd. | support@autocare.in | +91-1800-AUTOCARE', w / 2, 281, { align: 'center' });

                doc.save(fName);
            } catch (err) {
                console.error("PDF Generation Error: ", err);
                toast.error("Failed to render High-Def PDF.");
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
                    <strong className="receipt-info__value">{user?.name}</strong>
                    <span className="receipt-info__detail">{user?.email}</span>
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

        {/* Razorpay Perfect Visual Mock Overlay */}
        {razorpayMock?.isOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div className="animate-fade-up" style={{ width: '380px', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', fontFamily: 'Inter, sans-serif' }}>
                
                {/* Razorpay "Test Mode" Ribbon */}
                <div style={{ position: 'absolute', top: '15px', right: '-35px', background: '#d9534f', color: 'white', padding: '4px 40px', transform: 'rotate(45deg)', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                   TEST MODE
                </div>
                
                {/* Razorpay Brand Header */}
                <div style={{ background: '#3399cc', padding: '30px 20px', color: 'white', textAlign: 'center', position: 'relative' }}>
                    <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '4px', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <img src={logoImg} style={{ width: '24px', filter: 'brightness(0) sepia(1) hue-rotate(180deg) saturate(3)' }} alt="Logo" />
                    </div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>AutoCare Services</h3>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>#{razorpayMock.invoice._id.slice(-8).toUpperCase()}</p>
                    <div style={{ margin: '15px 0 0 0', fontSize: '28px', fontWeight: '700' }}>
                        ₹ {razorpayMock.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                {/* Body Selector Context */}
                <div style={{ padding: '24px 20px', background: '#f9fafb' }}>
                    
                    {!razorpayMock.selectedMode ? (
                        <>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
                                Payment Methods
                                <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }} onClick={() => setRazorpayMock(null)}>Cancel</button>
                            </div>
                            
                            {/* CC/DC */}
                            <div style={{ background: 'white', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => e.currentTarget.style.borderColor='#3399cc'} onMouseOut={(e) => e.currentTarget.style.borderColor='#e2e8f0'} onClick={() => setRazorpayMock({...razorpayMock, selectedMode: 'card'})}>
                                <div style={{ width: '36px', height: '36px', background: 'rgba(51, 153, 204, 0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="far fa-credit-card" style={{ fontSize: '16px', color: '#3399cc' }}></i>
                                </div>
                                <div>
                                   <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Card (Credit / Debit)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Visa, MasterCard, RuPay</div>
                                </div>
                                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: '12px' }}></i>
                            </div>

                            {/* UPI */}
                            <div style={{ background: 'white', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => e.currentTarget.style.borderColor='#3399cc'} onMouseOut={(e) => e.currentTarget.style.borderColor='#e2e8f0'} onClick={() => setRazorpayMock({...razorpayMock, selectedMode: 'upi'})}>
                                <div style={{ width: '36px', height: '36px', background: 'rgba(51, 153, 204, 0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-qrcode" style={{ fontSize: '16px', color: '#3399cc' }}></i>
                                </div>
                                <div>
                                   <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>UPI / QR</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Google Pay, PhonePe, Paytm</div>
                                </div>
                                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: '12px' }}></i>
                            </div>

                            {/* Netbanking */}
                            <div style={{ background: 'white', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => e.currentTarget.style.borderColor='#3399cc'} onMouseOut={(e) => e.currentTarget.style.borderColor='#e2e8f0'} onClick={() => setRazorpayMock({...razorpayMock, selectedMode: 'netbanking'})}>
                                <div style={{ width: '36px', height: '36px', background: 'rgba(51, 153, 204, 0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-university" style={{ fontSize: '16px', color: '#3399cc' }}></i>
                                </div>
                                <div>
                                   <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Netbanking</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>All major banks</div>
                                </div>
                                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: '12px' }}></i>
                            </div>
                        </>
                    ) : (
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setRazorpayMock({...razorpayMock, selectedMode: null})}>
                                <i className="fas fa-arrow-left" style={{ color: '#3399cc' }}></i> Back to Methods
                            </div>

                            {razorpayMock.selectedMode === 'card' && (
                                <div className="animate-fade-up">
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <i className="far fa-credit-card" style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }}></i>
                                            <input type="text" placeholder="Card Number (16 digits)" maxLength="16" value={paymentForm.cardNum} onChange={(e) => setPaymentForm({...paymentForm, cardNum: e.target.value})} style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', letterSpacing: '1px', background: 'white', color: '#333', outline: 'none' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                        <input type="text" placeholder="MM/YY" maxLength="5" value={paymentForm.expiry} onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: 'white', color: '#333', outline: 'none' }} />
                                        <input type="password" placeholder="CVV" maxLength="4" value={paymentForm.cvv} onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: 'white', color: '#333', outline: 'none' }} />
                                    </div>
                                </div>
                            )}

                            {razorpayMock.selectedMode === 'upi' && (
                                <div className="animate-fade-up" style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '10px' }}>Enter UPI ID</h4>
                                    <input type="text" placeholder="username@bank" value={paymentForm.upiId} onChange={(e) => setPaymentForm({...paymentForm, upiId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: 'white', color: '#333', outline: 'none' }} />
                                </div>
                            )}

                            {razorpayMock.selectedMode === 'netbanking' && (
                                <div className="animate-fade-up" style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '10px' }}>Select Bank</h4>
                                    <select value={paymentForm.bank} onChange={(e) => setPaymentForm({...paymentForm, bank: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: 'white', color: '#333', outline: 'none', cursor: 'pointer' }}>
                                        <option>SBI - State Bank of India</option>
                                        <option>HDFC Bank</option>
                                        <option>ICICI Bank</option>
                                        <option>Axis Bank</option>
                                        <option>Kotak Mahindra Bank</option>
                                    </select>
                                </div>
                            )}

                            {paymentError && (
                                <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '15px', textAlign: 'center', background: '#fef2f2', padding: '8px', borderRadius: '4px', border: '1px solid #fecaca' }}>
                                    <i className="fas fa-exclamation-circle" style={{marginRight: '5px'}}></i> {paymentError}
                                </div>
                            )}

                            <button className="btn w-full hover-lift" style={{ background: '#3399cc', color: 'white', border: 'none', boxShadow: '0 4px 6px rgba(51, 153, 204, 0.25)', fontSize: '14px', padding: '12px' }} onClick={() => {
                               setPaymentError('');
                               
                               if (razorpayMock.selectedMode === 'card') {
                                   if (!paymentForm.cardNum || paymentForm.cardNum.length < 15) return setPaymentError('Please enter a valid 16-digit card number.');
                                   if (!paymentForm.expiry || !paymentForm.expiry.includes('/')) return setPaymentError('Please enter a valid expiry date (MM/YY).');
                                   if (!paymentForm.cvv || paymentForm.cvv.length < 3) return setPaymentError('Please enter a valid CVV.');
                               } else if (razorpayMock.selectedMode === 'upi') {
                                   if (!paymentForm.upiId || !paymentForm.upiId.includes('@')) return setPaymentError('Please enter a valid UPI ID (e.g., name@bank).');
                               }

                               dispatch(payInvoice({
                                 id: razorpayMock.invoice._id,
                                 paymentData: {
                                   razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substr(2, 9),
                                   razorpay_order_id: razorpayMock.orderId,
                                   razorpay_signature: "mock_signature_bypass" 
                                 }
                               })).unwrap()
                               .then(() => toast.success('Payment successfully processed!'))
                               .catch((err) => toast.error('Payment rejected: ' + err));
                               
                               setRazorpayMock(null);
                            }}>
                               Pay ₹{razorpayMock.amount.toLocaleString('en-IN')}
                            </button>
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <i className="fas fa-lock"></i> Secured 256-bit Encryption
                    </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
