import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSkillsThunk = createAsyncThunk(
  'freelancer/fetchSkills',
  async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/skills/');
    return response.data;
  }
);





export const filteredFreelancers = createAsyncThunk(
  'freelancers/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    if (!categoryId || categoryId === 'undefined') {
      return rejectWithValue('Valid category ID is required');
    }
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/freelancers/filtered/?category=${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error occurred while fetching freelancers');
    }
  }
);








export const fetchFreelancerDataThunk = createAsyncThunk(
  'freelancer/fetchFreelancerData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://127.0.0.1:8000/api/profile/freelancer/', {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed syntax here
        },
      });

      const freelancerData = response.data;

      // Fetch all skills
      const skillsResponse = await axios.get('http://127.0.0.1:8000/api/skills/', {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed syntax here
        },
      });

      // Create a map of skill IDs to skill details
      const skillMap = skillsResponse.data.reduce((map, skill) => {
        map[skill.id] = skill;
        return map;
      }, {});

      // Map freelancer skill IDs to skill objects
      freelancerData.skills = freelancerData.skills.map(skillId =>
        skillMap[skillId] || { id: skillId, name: 'Unknown Skill' }
      );

      // Fetch all job categories
      const categoriesResponse = await axios.get('http://127.0.0.1:8000/api/categories/', {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed syntax here
        },
      });

      // Create a map of category IDs to category details
      const categoryMap = categoriesResponse.data.reduce((map, category) => {
        map[category.id] = category;
        return map;
      }, {});

      // Map freelancer job category IDs to category objects
      freelancerData.job_categories = freelancerData.job_categories.map(categoryId =>
        categoryMap[categoryId] || { id: categoryId, name: 'Unknown Category' }
      );

      return freelancerData;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
    }
  }
);



export const updateFreelancerProfile = createAsyncThunk(
  'freelancer/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      const response = await axios.put(
        'http://127.0.0.1:8000/api/profile/freelancer/',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error in updateFreelancerProfile:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue({ general: 'An unexpected error occurred. Please try again.' });
    }
  }
);

export const fetchJobCategoriesThunk = createAsyncThunk(
  'freelancer/fetchJobCategories',
  async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/categories/');
    return response.data;
  }
);

const freelancerSlice = createSlice({
  name: 'freelancer',
  initialState: {
    profile: { bio: '', skills: [], job_categories: [], name: '' },
    status: 'idle',
    error: null,
    profileComplete: false,
    availableSkills: [],
    availableJobCategories: [],
    filteredFreelancers: [],
    currentFreelancer: null,
  },
  reducers: {
    setProfileComplete: (state, action) => {
      state.profileComplete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillsThunk.fulfilled, (state, action) => {
        state.availableSkills = action.payload;
      })
      .addCase(updateFreelancerProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
        state.loading = false;
        // Ensure job_categories are properly updated
        if (action.payload.job_categories) {
          state.profile.job_categories = action.payload.job_categories;
        }
      })
      .addCase(updateFreelancerProfile.rejected, (state, action) => {
        console.error('Update failed:', action.payload);
      })
      .addCase(fetchFreelancerDataThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFreelancerDataThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        state.profileComplete = action.payload.bio && action.payload.skills.length > 0 && action.payload.job_categories.length > 0;
      })
      .addCase(fetchFreelancerDataThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchJobCategoriesThunk.fulfilled, (state, action) => {
        state.availableJobCategories = action.payload;
      })
      .addCase(filteredFreelancers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filteredFreelancers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredFreelancers = action.payload;
      })
      .addCase(filteredFreelancers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});



export const selectFreelancerProfile = (state) => state.freelancer.profile;

export const selectFreelancerStatus = (state) => state.freelancer.status;
export const selectFreelancerError = (state) => state.freelancer.error;

export const { setProfileComplete } = freelancerSlice.actions;
export default freelancerSlice.reducer;