import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJobCategories } from '../apis/jobcatAPI';

// Async thunk for fetching job categories
export const getJobCategories = createAsyncThunk(
  'jobCategories/getJobCategories',
  async () => {
    const response = await fetchJobCategories();
    return response.data;
  }
);

const jobCategoriesSlice = createSlice({
  name: 'jobCategories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getJobCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllJobCategories = (state) => state.jobCategories.items;
export const selectJobCategoriesStatus = (state) => state.jobCategories.status;
export const selectJobCategoriesError = (state) => state.jobCategories.error;

export default jobCategoriesSlice.reducer;
