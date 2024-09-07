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

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`);
      console.log('Job details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const applyForJob = createAsyncThunk(
  'jobs/applyForJob',
  async ({ jobId, coverLetter, proposedPay, estimatedCompletionTime }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userInfo = state.login.userInfo;

      if (!userInfo || userInfo.role !== 'FREELANCER') {
        throw new Error('Only freelancers can apply for jobs');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.access}`,  // Ensure the correct token is used
        },
      };

      const response = await axios.post(
        `http://127.0.0.1:8000/api/jobs/${jobId}/apply/`,
        { cover_letter: coverLetter, proposed_pay: proposedPay, estimated_completion_time: estimatedCompletionTime },
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

export const fetchClientJobs = createAsyncThunk(
    'jobs/fetchClientJobs',
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = getState();
        const userInfo = state.login.userInfo;
  
        if (!userInfo || !userInfo.access) {
          throw new Error('User is not logged in or access token is missing');
        }
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.access}`,
          },
        };
  
        const response = await axios.get('http://127.0.0.1:8000/api/client/jobs/', config);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  export const fetchJobApplications = createAsyncThunk(
    'jobs/fetchJobApplications',
    async (jobId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/applications/`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );


  export const fetchFreelancerJobApplications = createAsyncThunk(
    'jobs/fetchFreelancerJobApplications',
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = getState();
        const userInfo = state.login.userInfo;
  
        if (!userInfo || !userInfo.access) {
          throw new Error('User is not logged in or access token is missing');
        }
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.access}`,
          },
        };
  
        const response = await axios.get('http://127.0.0.1:8000/api/freelancer/applications/', config);
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
    jobDetails: {},
    status: 'idle',
    error: null,
    applicationStatus: 'idle',
    applicationError: null,
    clientJobsStatus: 'idle',
    clientJobsError: null,
    jobApplicationsStatus: 'idle',
    jobApplicationsError: null,
    clientJobs: [],
    jobApplications: [],
    freelancerJobApplications: [],
    freelancerJobApplicationsStatus: 'idle',
    freelancerJobApplicationsError: null,
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
      })
      .addCase(fetchJobDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(applyForJob.pending, (state) => {
        state.applicationStatus = 'loading';
      })
      .addCase(applyForJob.fulfilled, (state) => {
        state.applicationStatus = 'succeeded';
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applicationStatus = 'failed';
        state.applicationError = action.payload;
      })
      .addCase(fetchClientJobs.pending, (state) => {
        state.clientJobsStatus = 'loading';
      })
      .addCase(fetchClientJobs.fulfilled, (state, action) => {
        state.clientJobsStatus = 'succeeded';
        state.clientJobs = action.payload;
      })
      .addCase(fetchClientJobs.rejected, (state, action) => {
        state.clientJobsStatus = 'failed';
        state.clientJobsError = action.payload;
      })
      .addCase(fetchJobApplications.pending, (state) => {
        state.jobApplicationsStatus = 'loading';
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.jobApplicationsStatus = 'succeeded';
        state.jobApplications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.jobApplicationsStatus = 'failed';
        state.jobApplicationsError = action.payload;
      })
      .addCase(fetchFreelancerJobApplications.pending, (state) => {
        state.freelancerJobApplicationsStatus = 'loading';
      })
      .addCase(fetchFreelancerJobApplications.fulfilled, (state, action) => {
        state.freelancerJobApplicationsStatus = 'succeeded';
        state.freelancerJobApplications = action.payload;
      })
      .addCase(fetchFreelancerJobApplications.rejected, (state, action) => {
        state.freelancerJobApplicationsStatus = 'failed';
        state.freelancerJobApplicationsError = action.payload;
      });
  },
});

export const selectJobDetails = (state, id) => state.jobs.jobDetails[id];
export const selectJobStatus = (state) => state.jobs.status;
export const selectJobError = (state) => state.jobs.error;
export const selectApplicationStatus = (state) => state.jobs.applicationStatus;
export const selectApplicationError = (state) => state.jobs.applicationError;


export const selectClientJobs = (state) => state.jobs.clientJobs;
export const selectClientJobsStatus = (state) => state.jobs.clientJobsStatus;
export const selectClientJobsError = (state) => state.jobs.clientJobsError;
export const selectJobApplications = (state) => state.jobs.jobApplications;
export const selectJobApplicationsStatus = (state) => state.jobs.jobApplicationsStatus;
export const selectJobApplicationsError = (state) => state.jobs.jobApplicationsError;


export const selectFreelancerJobApplications = (state) => state.jobs.freelancerJobApplications;
export const selectFreelancerJobApplicationsStatus = (state) => state.jobs.freelancerJobApplicationsStatus;
export const selectFreelancerJobApplicationsError = (state) => state.jobs.freelancerJobApplicationsError;


export default jobsSlice.reducer;
