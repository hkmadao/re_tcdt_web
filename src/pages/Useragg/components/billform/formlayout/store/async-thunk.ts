import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import { TUser } from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TUser }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TUser = await FormAPI.getById(selectedRow.idUser!);
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TUser = await FormAPI.getById(state.selectedRow?.idUser);
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TUser = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TUser = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
