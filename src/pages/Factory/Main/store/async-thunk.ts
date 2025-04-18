import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { moduleReducerName } from '../conf';
import { TModuleStore, TUiFactory } from '../model';
import ModuleAPI from '../api';

export const fetchById = createAsyncThunk(
  `${moduleReducerName}/fetchById`,
  async (id: string, thunkAPI) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleReducerName];
    const billform: TUiFactory = await ModuleAPI.getById(id);
    return billform;
  },
);
