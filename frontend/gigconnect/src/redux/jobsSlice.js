import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating a job
export const createJobThunk = createAsyncThunk(
    'jobs/createJob',
    async (jobData, { rejectWithValue, getState }) => {
      try {
        const { login } = getState();
        if (!login || !login.userInfo || !login.userInfo.access) {
          throw new Error('User is not logged in or access token is missing');
        }
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${login.userInfo.access}`,
          },
        };
  
        console.log('Sending job data:', jobData);
        console.log('Request config:', config);
  
        const response = await axios.post('http://127.0.0.1:8000/api/jobs/', jobData, config);
        console.log('Job created successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating job:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const fetchJobsFiltered = createAsyncThunk(
    'jobs/fetchJobsFiltered',
    async (filters, { rejectWithValue }) => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jobsl/filtered/', { params: filters });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  




// Async thunk for fetching jobs (you can implement this later)
export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jobsl/');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    createJobStatus: 'idle',
    createJobError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createJobThunk.pending, (state) => {
        state.createJobStatus = 'loading';
      })
      .addCase(createJobThunk.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
        state.createJobStatus = 'succeeded';
      })
      .addCase(createJobThunk.rejected, (state, action) => {
        state.createJobStatus = 'failed';
        state.createJobError = action.payload;
      })
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchJobsFiltered.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobsFiltered.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobsFiltered.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
      
  },
});

export default jobsSlice.reducer;
