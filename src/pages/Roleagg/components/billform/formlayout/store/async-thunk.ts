import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import { TRole } from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TRole }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TRole = await FormAPI.getById(selectedRow.idRole!);
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TRole = await FormAPI.getById(state.selectedRow?.idRole);
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TRole = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TRole = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
