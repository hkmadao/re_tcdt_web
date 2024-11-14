import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

export * from './selects';
import { generateInitData, initialState } from './initial-state';
import { moduleReducerName } from '../conf';
import * as mainActionReducers from './main-action';
import { fetchById } from './async-thunk';
import { TUiFactory, TUiFactoryContent } from '../model';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    changePageStatus: (state, action: PayloadAction<string>) => {
      state.currentPageId = action.payload;
    },
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
        const uiFactory = action.payload;
        if (!uiFactory) {
          return;
        }
        state.currentLayoutId = undefined;
        state.currentPageId = undefined;
        const uiFactoryCommon: TUiFactory = {
          ...uiFactory,
          content: undefined,
        };
        if (uiFactory.content) {
          const billFormContent: TUiFactoryContent = JSON.parse(
            uiFactory.content,
          );
          state.data = {
            ...uiFactoryCommon,
            modleType: billFormContent.modleType,
            pages: billFormContent.pages,
            layouts: billFormContent.layouts,
            assos: billFormContent.assos,
          };
        } else {
          const { pages, layouts, assos } = generateInitData().data;
          state.data = {
            ...{
              ...uiFactoryCommon,
              pages,
              layouts,
              assos,
              content: undefined,
            },
          };
        }
        state.currentPageId = state.data.pages[0].id;
      });
  },
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    mainFactory: slice.reducer,
  },
});
