import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { moduleReducerName } from '../conf';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import CommonAPI from '../../common/api';
import { fillTreeDatas } from '../../common/util';
import { TModuleStore, TQuery } from '../model';
import ModuleAPI from '../api';

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
  async (param: { id: string; idComponent: string }, thunkAPI) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleReducerName];
    const query: TQuery = await ModuleAPI.getById(param.id);
    let metaData;
    if (!query.metaData) {
      const componentTreeData: TTree =
        await CommonAPI.getComponentAttributeTreeById({
          id: param.idComponent,
        });
      const newMetaData = [componentTreeData];
      fillTreeDatas(newMetaData, undefined);
      metaData = newMetaData[0];
    }
    return { query, metaData };
  },
);
