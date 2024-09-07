import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSkillsThunk = createAsyncThunk(
  'freelancer/fetchSkills',
  async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/skills/');
    return response.data;
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
          Authorization: `Bearer ${token}`,
        },
      });

      const freelancerData = response.data;

      // Fetch all skills
      const skillsResponse = await axios.get('http://127.0.0.1:8000/api/skills/', {
        headers: {
          Authorization: `Bearer ${token}`,
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

export const updateFreelancerProfileThunk = createAsyncThunk(
  'freelancer/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      const dataToSend = {
        bio: profileData.bio,
        skill_ids: profileData.skills,
        job_category_ids: profileData.jobCategories
      };

      console.log('Sending data to backend:', dataToSend); // Debug log

      const response = await axios.put(
        'http://127.0.0.1:8000/api/profile/freelancer/',
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error in updateFreelancerProfileThunk:', error);
      return rejectWithValue({
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
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
    profile: { bio: '', skills: [], jobCategories: [], name: '' },
    status: 'idle',
    error: null,
    profileComplete: false,
    availableSkills: [],
    availableJobCategories: [],
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
      .addCase(updateFreelancerProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileComplete = true;
      })
      .addCase(updateFreelancerProfileThunk.rejected, (state, action) => {
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
      });
  },
});

export const { setProfileComplete } = freelancerSlice.actions;
export default freelancerSlice.reducer;