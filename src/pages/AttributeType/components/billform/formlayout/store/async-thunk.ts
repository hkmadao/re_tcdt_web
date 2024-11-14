import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import { TDataType } from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TDataType }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TDataType = await FormAPI.getById(
      selectedRow.idDataType!,
    );
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TDataType = await FormAPI.getById(
      state.selectedRow?.idDataType,
    );
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TDataType = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TDataType = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
