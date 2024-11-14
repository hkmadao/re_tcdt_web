import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { moduleReducerName } from '../conf';
import ModuleAPI from '../api';
import { TModuleStore, TTreeConf } from '../model';
import CommonAPI from '../../common/api';
import { TTree } from '@/models/common';
import { fillTreeDatas } from '../../common/util';

export const getComponentAttributeTreeById = createAsyncThunk(
  `${moduleReducerName}/getComponentAttributeTreeById`,
  async (idComponent: string | void, thunkAPI) => {
    if (!idComponent) {
      return;
    }
    const componentTreeData: TTree =
      await CommonAPI.getComponentAttributeTreeById({
        id: idComponent,
      });
    const newMetaData = [componentTreeData];
    fillTreeDatas(newMetaData, undefined);
    return newMetaData[0];
  },
);

export const fetchById = createAsyncThunk(
  `${moduleReducerName}/fetchById`,
  async (id: string, thunkAPI) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleReducerName];
    const billform: TTreeConf = await ModuleAPI.getById(id);
    return billform;
  },
);
