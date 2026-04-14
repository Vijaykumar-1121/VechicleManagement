import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/servicerecords/';

// Create new service record (Technician)
export const createServiceRecord = createAsyncThunk('serviceRecords/create', async (recordData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, recordData, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get records by vehicle
export const getServiceRecordsByVehicle = createAsyncThunk('serviceRecords/getByVehicle', async (vehicleId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}vehicle/${vehicleId}`, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get record by appointment
export const getServiceRecordByAppointment = createAsyncThunk('serviceRecords/getByAppointment', async (appointmentId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}appointment/${appointmentId}`, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const serviceRecordSlice = createSlice({
  name: 'serviceRecord',
  initialState: {
    records: [],
    currentRecord: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceRecord.pending, (state) => { state.isLoading = true; })
      .addCase(createServiceRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.records.push(action.payload);
      })
      .addCase(createServiceRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getServiceRecordsByVehicle.pending, (state) => { state.isLoading = true; })
      .addCase(getServiceRecordsByVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.records = action.payload;
      })
      .addCase(getServiceRecordsByVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getServiceRecordByAppointment.pending, (state) => { state.isLoading = true; })
      .addCase(getServiceRecordByAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentRecord = action.payload;
      })
      .addCase(getServiceRecordByAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = serviceRecordSlice.actions;
export default serviceRecordSlice.reducer;
