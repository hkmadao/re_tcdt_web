import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

import { initialState } from './initial-state';
import { moduleReducerName } from '../conf';
import * as mainActionReducers from './main-action';
import { fetchById } from './async-thunk';
import { TAction, TActionContent } from '../model';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    ...mainActionReducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchById.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const syncData = action.payload;
        if (!syncData) {
          return;
        }
        state.current = undefined;
        const queryCommon: TAction = {
          ...syncData,
          content: undefined,
        };
        if (syncData.content) {
          const queryContent: TActionContent = JSON.parse(syncData.content);
          state.data = {
            ...queryCommon,
            buttons: queryContent.buttons,
            gap: queryContent.gap,
            justifyContent: queryContent.justifyContent,
          };
          return;
        }
        state.data = {
          ...{
            ...queryCommon,
            gap: '10px',
            justifyContent: 'start',
            buttons: [],
          },
        };
      });
  },
});

export const actions = slice.actions;

const reducer: any = {};
reducer[slice.name] = slice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});
