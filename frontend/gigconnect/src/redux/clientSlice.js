import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchClientDataThunk = createAsyncThunk(
  'client/fetchClientData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://127.0.0.1:8000/api/profile/client/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateClientProfileThunk = createAsyncThunk(
  'client/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      console.log('Sending data to backend:', profileData); // Debug log

      const response = await axios.put(
        'http://127.0.0.1:8000/api/profile/client/',
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
      console.error('Error in updateClientProfileThunk:', error);
      return rejectWithValue({
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
    }
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState: {
    profile: { company_name: '', website: '', user: null },
    status: 'idle',
    error: null,
    profileComplete: false,
  },
  reducers: {
    setProfileComplete: (state, action) => {
      state.profileComplete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientDataThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientDataThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        state.profileComplete = !!action.payload.company_name;
      })
      .addCase(fetchClientDataThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateClientProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileComplete = true;
      })
      .addCase(updateClientProfileThunk.rejected, (state, action) => {
        console.error('Update failed:', action.payload);
      });
  },
});

export const { setProfileComplete } = clientSlice.actions;
export default clientSlice.reducer;

