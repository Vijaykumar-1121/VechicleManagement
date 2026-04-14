import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analysisService } from '../services/api';

export const analyzeSymptoms = createAsyncThunk('reports/analyze', async (data, thunkAPI) => {
  try {
    const res = await analysisService.analyze(data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Analysis failed');
  }
});

export const fetchReports = createAsyncThunk('reports/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await analysisService.getReports();
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
  }
});

export const fetchReport = createAsyncThunk('reports/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await analysisService.getReport(id);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch report');
  }
});

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    currentReport: null,
    analysisResult: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAnalysis: (state) => {
      state.analysisResult = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Analyze
      .addCase(analyzeSymptoms.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(analyzeSymptoms.fulfilled, (state, action) => { state.isLoading = false; state.analysisResult = action.payload; })
      .addCase(analyzeSymptoms.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Fetch all reports
      .addCase(fetchReports.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchReports.fulfilled, (state, action) => { state.isLoading = false; state.reports = action.payload; })
      .addCase(fetchReports.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Fetch single report
      .addCase(fetchReport.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchReport.fulfilled, (state, action) => { state.isLoading = false; state.currentReport = action.payload; })
      .addCase(fetchReport.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearAnalysis, clearError } = reportSlice.actions;
export default reportSlice.reducer;
