import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

export * from './selects';
import { getInitialState, initialState } from './initial-state';
import { moduleReducerName } from '../conf';
import * as mainActionReducers from './main-action';
import { fetchById, getComponentAttributeTreeById } from './async-thunk';
import { TTreeConf, TTreeContent } from '../model';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    ...mainActionReducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComponentAttributeTreeById.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        state.data.metaData = action.payload;
      })
      .addCase(fetchById.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const uiFactory = action.payload;
        if (!uiFactory) {
          return;
        }
        const uiFactoryCommon: TTreeConf = {
          ...uiFactory,
          content: undefined,
        };
        if (uiFactory.content) {
          const billFormContent: TTreeContent = JSON.parse(uiFactory.content);
          state.data = {
            ...uiFactoryCommon,
            metaData: undefined,
            twoLevelStatus: billFormContent.twoLevelStatus,
            searchAttrs: billFormContent.searchAttrs,
            firstTreeRef: billFormContent.firstTreeRef,
            thirdTreeRef: billFormContent.thirdTreeRef,
          };
          if (uiFactory.metaData) {
            state.data.metaData = JSON.parse(uiFactory.metaData);
          }
        } else {
          const { twoLevelStatus, searchAttrs, firstTreeRef, thirdTreeRef } =
            getInitialState().data;
          state.data = {
            ...uiFactoryCommon,
            metaData: undefined,
            twoLevelStatus,
            searchAttrs,
            firstTreeRef,
            thirdTreeRef,
          };
          if (uiFactory.metaData) {
            state.data.metaData = JSON.parse(uiFactory.metaData);
          }
        }
      });
  },
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    treeFactory: slice.reducer,
  },
});
