import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchJobCategories, 
  fetchJobCategoryDetails, 
  fetchJobCategoryFreelancers, 
  fetchSkills, 
  fetchSkillDetails, 
  fetchSkillFreelancers 
} from '../apis/jobcatAPI';

// Async thunks
export const getJobCategories = createAsyncThunk('jobCategories/fetchJobCategories', async () => {
  return await fetchJobCategories();
});

export const getJobCategoryDetails = createAsyncThunk('jobCategories/fetchJobCategoryDetails', async (id) => {
  return await fetchJobCategoryDetails(id);
});

export const getJobCategoryFreelancers = createAsyncThunk('jobCategories/fetchJobCategoryFreelancers', async (id) => {
  return await fetchJobCategoryFreelancers(id);
});

export const getSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { getState }) => {
    const { jobCategories } = getState();
    if (jobCategories.skills.length > 0) {
      return jobCategories.skills;
    }
    return await fetchSkills();
  }
);


export const getSkillDetails = createAsyncThunk('skills/fetchSkillDetails', async (id) => {
  return await fetchSkillDetails(id);
});

export const getSkillFreelancers = createAsyncThunk('skills/fetchSkillFreelancers', async (id) => {
  return await fetchSkillFreelancers(id);
});

// Slice
const jobcatSlice = createSlice({
  name: 'jobCategories',
  initialState: {
    categories: [],
    categoryDetails: {},
    categoryFreelancers: [],
    skills: [],
    skillDetails: {},
    skillFreelancers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Job Categories
      .addCase(getJobCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(getJobCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Job Category Details
      .addCase(getJobCategoryDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobCategoryDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categoryDetails[action.payload.id] = action.payload;
      })
      .addCase(getJobCategoryDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Job Category Freelancers
      .addCase(getJobCategoryFreelancers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobCategoryFreelancers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categoryFreelancers = action.payload;
      })
      .addCase(getJobCategoryFreelancers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Skills
      .addCase(getSkills.pending, (state) => {
        if (state.status === 'idle') {
          state.status = 'loading';
        }
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = action.payload;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Skill Details
      .addCase(getSkillDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSkillDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skillDetails[action.payload.id] = action.payload;
      })
      .addCase(getSkillDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Skill Freelancers
      .addCase(getSkillFreelancers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSkillFreelancers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skillFreelancers = action.payload;
      })
      .addCase(getSkillFreelancers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectAllJobCategories = (state) => state.jobCategories.categories;
export const selectJobCategoryDetails = (state, id) => state.jobCategories.categoryDetails[id];
export const selectJobCategoryFreelancers = (state) => state.jobCategories.categoryFreelancers;
export const selectAllSkills = (state) => state.jobCategories.skills;
export const selectSkillDetails = (state, id) => state.jobCategories.skillDetails[id];
export const selectSkillFreelancers = (state) => state.jobCategories.skillFreelancers;

// New selectors
export const selectJobCategoriesStatus = (state) => state.jobCategories.status;
export const selectJobCategoriesError = (state) => state.jobCategories.error;

export const selectSkillStatus = (state) => state.jobCategories.status;
export const selectSkillError = (state) => state.jobCategories.error;

export default jobcatSlice.reducer;
