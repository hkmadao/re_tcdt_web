import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import { TMenu } from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TMenu }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TMenu = await FormAPI.getById(selectedRow.idMenu!);
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TMenu = await FormAPI.getById(state.selectedRow?.idMenu);
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TMenu = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TMenu = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
