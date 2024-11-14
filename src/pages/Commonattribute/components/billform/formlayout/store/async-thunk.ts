import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import { TCommonAttribute } from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (
    params: { nodeData: any; selectedRow: TCommonAttribute },
    thunkAPI,
  ) => {
    const { nodeData, selectedRow } = params;
    const detailData: TCommonAttribute = await FormAPI.getById(
      selectedRow.idCommonAttribute!,
    );
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TCommonAttribute = await FormAPI.getById(
      state.selectedRow?.idCommonAttribute,
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
      const saveData: TCommonAttribute = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TCommonAttribute = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
