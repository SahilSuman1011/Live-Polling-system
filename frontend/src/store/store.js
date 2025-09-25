import { configureStore } from '@reduxjs/toolkit';
import pollSlice from './slices/pollSlice.js';

export const store = configureStore({
  reducer: {
    poll: pollSlice,
  },
});

export default store;