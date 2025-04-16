import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import noteReducer from './noteSlice';

export const store = configureStore({
  reducer: {
    auth: userReducer,
    notes: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;