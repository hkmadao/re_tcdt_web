import { createAsyncThunk } from '@reduxjs/toolkit';
import { moduleReducerName } from '../conf';
import { TModuleStore, TAction } from '../model';
import ModuleAPI from '../api';

export const fetchById = createAsyncThunk(
  `${moduleReducerName}/fetchById`,
  async (id: string, thunkAPI) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleReducerName];
    const q: TAction = await ModuleAPI.getById(id);
    return q;
  },
);
