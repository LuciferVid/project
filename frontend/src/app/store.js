import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';
import { apiSlice } from './apiSlice.js';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});
