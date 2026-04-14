export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const getStatusColor = (status) => {
  const colors = {
    'Booked': '#6366f1',
    'Confirmed': '#3b82f6',
    'Vehicle Received': '#06b6d4',
    'Inspection': '#f59e0b',
    'In Progress': '#f97316',
    'Completed': '#10b981',
    'Cancelled': '#ef4444',
    'Paid': '#10b981',
    'Pending': '#f59e0b',
  };
  return colors[status] || '#6366f1';
};

export const calculateServiceCost = (serviceType) => {
  const prices = {
    'General Service': 2500,
    'Oil Change': 1500,
    'Engine Repair': 8000,
    'Brake Inspection': 2000,
    'Battery Replacement': 4500,
    'Tire Replacement': 6000,
    'AC Service': 3000,
    'Electrical Work': 3500,
    'Body Repair': 10000,
    'Full Inspection': 1500,
  };
  return prices[serviceType] || 2000;
};
