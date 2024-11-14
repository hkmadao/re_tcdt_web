import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';

export * from './selects';
import {
  getInitConfigForm,
  getInitConfigList,
  initialState,
} from './initial-state';
import { moduleReducerName } from '../conf';
import { fetchById, getComponentAttributeTreeById } from './async-thunk';
import { TBillForm, TBillFormContent } from '../model';
import * as commonActionReducers from './common';
import * as billformActionReducers from './billform';
import * as billtableActionReducers from './billtable';
import { TDescriptionInfo } from '../../common/model';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    ...commonActionReducers,
    ...billformActionReducers,
    ...billtableActionReducers,
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
        const { billform, metaData } = action.payload;
        if (!billform) {
          return;
        }
        state.current = undefined;
        state.fgForm = false;
        state.tip = undefined;
        const billformCommon: TBillForm = {
          ...billform,
          metaData: undefined,
          content: undefined,
        };
        if (billform.content) {
          const billFormContent: TBillFormContent = JSON.parse(
            billform.content,
          );
          if (!billFormContent.configList) {
            billFormContent.configList = getInitConfigList();
          }
          if (!billFormContent.configForm) {
            billFormContent.configForm = getInitConfigForm();
          }
          state.data = {
            ...billformCommon,
            metaData: undefined,
            configList: billFormContent.configList,
            configForm: billFormContent.configForm,
          };
          state.data.metaData = metaData;
          if (!metaData && billform.metaData) {
            const metaDataObj: TDescriptionInfo = JSON.parse(billform.metaData);
            state.data.metaData = metaDataObj;
          }
          return;
        }
        state.data = {
          ...{ ...billformCommon },
          metaData: metaData,
          configList: getInitConfigList(),
          configForm: getInitConfigForm(),
        };
      });
  },
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    formFactory: slice.reducer,
  },
});
