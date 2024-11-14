import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';
export * from './selects';
import { initialState } from './initial-state';
import { TCodeGenerateConfig, TPageCode, moduleReducerName } from '../models';

import * as itemReducers from './items';

export const slice = createSlice({
  name: moduleReducerName,
  initialState,
  reducers: {
    changePageStatus: (state, action: PayloadAction<TPageCode>) => {
      state.pageCode = action.payload;
    },
    setCurrentSelectConfId: (state, action: PayloadAction<string>) => {
      state.data.idCurrent = action.payload;
    },
    setConfListAndIdCurrent: (
      state,
      action: PayloadAction<TCodeGenerateConfig[]>,
    ) => {
      state.data.confDataList = action.payload;
      const activeConf = state.data.confDataList.find((conf) => conf.fgActive);
      if (activeConf) {
        state.data.idCurrent = activeConf.id;
      }
    },
    addConfList: (state, action: PayloadAction<TCodeGenerateConfig[]>) => {
      state.data.confDataList = action.payload;
      const activeConf = state.data.confDataList.find((conf) => conf.fgActive);
      if (activeConf && !state.data.idCurrent) {
        state.data.idCurrent = activeConf.id;
      }
    },
    addConf: (state, action: PayloadAction<TCodeGenerateConfig>) => {
      const newConf = action.payload;
      state.data.confDataList.push(newConf);
      state.data.idCurrent = newConf.id;
    },
    updateConf: (state, action: PayloadAction<TCodeGenerateConfig>) => {
      const updateConf = action.payload;
      const index = state.data.confDataList.findIndex(
        (conf) => conf.id === updateConf.id,
      );
      if (index !== -1) {
        state.data.confDataList.splice(index, 1, updateConf);
      }
      state.data.idCurrent = updateConf.id;
    },
    ...itemReducers,
  },
  extraReducers: (builder) => {},
});

export const actions = slice.actions;

export default configureStore({
  reducer: {
    programConfReducer: slice.reducer,
  },
});
