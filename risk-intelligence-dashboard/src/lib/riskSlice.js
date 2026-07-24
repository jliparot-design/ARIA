import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchRiskData = createAsyncThunk(
  "riskData/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/risk');
      if (!res.ok) throw new Error('Failed to fetch risk data');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopics = createAsyncThunk(
  "riskData/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/topics');
      if (!res.ok) throw new Error('Failed to fetch topics');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const riskSlice = createSlice({
  name: "risk",
  initialState: {
    items: null,
    topics: [],      
    loading: false,
    error: null,
    selected: null,
    selectedRank: null,
  },
  reducers: {
    setSelectedRisk: (state, action) => {
      state.selected = action.payload.selected;
      state.selectedRank = action.payload.rank;
    },
    clearSelectedRisk: (state) => {
      state.selected = null;
      state.selectedRank = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiskData.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRiskData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics = action.payload;
      });
  },
});

export const { setSelectedRisk, clearSelectedRisk } = riskSlice.actions;
export default riskSlice.reducer;