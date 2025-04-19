import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { AxiosError } from 'axios';
import { RootState } from './index';

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  user?: string;
}

export interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: NoteState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all notes
export const getNotes = createAsyncThunk(
  'notes/getAll',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;

      const response = await api.get('/api/note', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get note by ID
export const getNoteById = createAsyncThunk(
  'notes/getById',
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;

      const response = await api.get(`/api/note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new note
export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData: Omit<Note, '_id'>, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;

      const response = await api.post('/api/note', noteData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update note
export const updateNote = createAsyncThunk(
  'notes/update',
  async (noteData: Note, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;

      const { _id, ...updateData } = noteData;
      const response = await api.put(`/api/note/${_id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete note
export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;

      await api.delete(`/api/note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotes: (state) => {
      state.notes = [];
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getNoteById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentNote = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentNote = action.payload;
        state.notes = state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = state.notes.filter((note) => note._id !== action.payload);
        state.currentNote = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { clearNotes, clearCurrentNote, resetState } = noteSlice.actions;
export default noteSlice.reducer;
