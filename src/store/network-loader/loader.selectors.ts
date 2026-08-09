import { RootState } from "../index";

export const selectIsLoading = (state: RootState) =>
  state.loader.activeRequests > 0;

export const selectActiveRequests = (state: RootState) =>
  state.loader.activeRequests;