import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  minLikelihood: 1,
  minSeverity: 1,
  topics: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setMinLikelihood: (state, action) => {
      state.minLikelihood = action.payload;
    },
    setMinSeverity: (state, action) => {
      state.minSeverity = action.payload;
    },
    addTopic: (state, action) => {
      state.topics.push(action.payload);
    },
    addAllTopics: (state, action) => {
      state.topics = action.payload;
    },
    removeAllTopics: (state) => {
      state.topics = [];
    },
    removeTopic: (state, action) => {
      state.topics = state.topics.filter((topic) => topic !== action.payload);
    },
    clearFilters: (state) => {
      state.minLikelihood = 1;
      state.minSeverity = 1;
      state.topics = [];
    },
  },
});

export const {
  setMinLikelihood,
  setMinSeverity,
  addTopic,
  addAllTopics,
  removeAllTopics,
  removeTopic,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
