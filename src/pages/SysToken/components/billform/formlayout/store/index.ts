import {
  configureStore,
  createSlice,
  CaseReducer,
  PayloadAction,
  nanoid,
} from '@reduxjs/toolkit';
import { message as antdMessage } from 'antd';
import { DOStatus } from '@/models';
import { reflesh, toEdit, save } from './async-thunk';
import { componentName } from '../conf';
import { initialState } from './initial-state';
import * as reducers from './actions';
import * as itemReducers from './items';
import { subject } from '../../../../conf';
import { deepCopy } from '@/util';

export * from './async-thunk';

const reducer: any = {};
reducer[formSlice.name] = formSlice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});
