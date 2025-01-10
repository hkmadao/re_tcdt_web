import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

export * from './hooks';
import { initialState } from './initial-state';
import { moduleReducerName } from '../conf';
import * as mainActionReducers from './main-action';
import { fetchTableData, fetchTreeData } from './async-thunk';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    ...mainActionReducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        const { pageInfo, searchValues } = action.payload;
        state.status = 'succeeded';
        state.pageInfo = pageInfo;
        state.searchValues = searchValues;
      })
      .addCase(fetchTreeData.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTreeData.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchTreeData.fulfilled, (state, action) => {
        const treeData = action.payload;
        state.status = 'succeeded';
        state.treeData = treeData;
      });
  },
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    ref: slice.reducer,
  },
});
