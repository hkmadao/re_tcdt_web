import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

export * from './selects';
import { initialState } from './initial-state';
import { moduleReducerName } from '../conf';
import * as mainActionReducers from './main-action';
import { fetchById, getComponentAttributeTreeById } from './async-thunk';
import { TQuery, TQueryContent } from '../model';
import { TDescriptionInfo } from '../../common/model';

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
        const { query, metaData } = action.payload;
        if (!query) {
          return;
        }
        state.current = undefined;
        const queryCommon: TQuery = {
          ...query,
          metaData: undefined,
          content: undefined,
        };
        if (query.content) {
          const queryContent: TQueryContent = JSON.parse(query.content);
          state.data = {
            ...queryCommon,
            metaData: undefined,
            searchRefs: queryContent.searchRefs,
          };
          state.data.metaData = metaData;
          if (!metaData && query.metaData) {
            const metaDataObj: TDescriptionInfo = JSON.parse(query.metaData);
            state.data.metaData = metaDataObj;
          }
          return;
        }
        state.data = {
          ...{
            ...queryCommon,
            metaData: metaData,
            searchRefs: [],
          },
        };
      });
  },
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    queryFactory: slice.reducer,
  },
});
