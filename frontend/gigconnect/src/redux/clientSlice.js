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
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      const response = await axios.post(
        'http://127.0.0.1:8000/api/profile/client/',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setProfileComplete(true));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState: {
    profile: { company_name: '', website: '', user: {} },
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
      });
  },
});

export const { setProfileComplete } = clientSlice.actions;
export default clientSlice.reducer;

