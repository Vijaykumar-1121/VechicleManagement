import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import reportReducer from './reportSlice';
import vehicleReducer from './vehicleSlice';
import appointmentReducer from './appointmentSlice';
import serviceRecordReducer from './serviceRecordSlice';
import invoiceReducer from './invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    report: reportReducer,
    vehicle: vehicleReducer,
    appointment: appointmentReducer,
    serviceRecord: serviceRecordReducer,
    invoice: invoiceReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
