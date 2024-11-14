import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

export * from './selects';
import { initialState } from './initial-state';
import { moduleReducerName } from '../conf';
// import * as mainActionReducers from './main-action';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    // ...mainActionReducers,
  },
  extraReducers: (builder) => {},
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    customFactory: slice.reducer,
  },
});
