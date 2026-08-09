import { configureStore } from "@reduxjs/toolkit";

import loaderReducer from "./network-loader/loader.slice";
import themeReducer from "./theme/theme.slice";

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
