import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  activeRequests: number;
}

const initialState: LoaderState = {
  activeRequests: 0,
}

const loaderSlice = createSlice({
  name: "loader",

initialState,

  reducers: {
    increment(state) {
      state.activeRequests++;
    },

    decrement(state) {
      state.activeRequests = Math.max(
        state.activeRequests - 1,
        0
      );
    },

    reset(state) {
      state.activeRequests = 0;
    },
  },
});

export const loaderActions = loaderSlice.actions;

export default loaderSlice.reducer;