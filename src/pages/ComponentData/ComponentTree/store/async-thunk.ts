import { createAsyncThunk } from '@reduxjs/toolkit';
import { TComponentEntityCollection, TComponentModule, TTree } from '../models';
import ComponentTreeAPI from '../api';
import ComponentDesignAPI from '../../ComponentDesign/api';
import {
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TcdtType,
  TCondition,
} from '@/models';
import { TComponentSaveResult } from '../../ComponentDesign/models';
import { message } from 'antd';

export const fetchComponentProjectTree = createAsyncThunk(
  `/fetchComponentProjectTree`,
  async () => {
    const treeArr: TTree[] = await ComponentTreeAPI.componentProjectTree();
    return treeArr;
  },
);

export const searchTreeNode = createAsyncThunk(
  `/searchTreeNode`,
  async (searchValue: string, thunkAPI) => {
    const entiCond: TCondition = {
      logicNode: orLogicNode([
        likeFullFilterNode(
          'ddEntity.tableName',
          stringFilterParam(searchValue),
        ),
        likeFullFilterNode(
          'ddEntity.className',
          stringFilterParam(searchValue),
        ),
      ])(),
    };
    const entities = await ComponentDesignAPI.getCompEntities(entiCond);
    const enumCond: TCondition = {
      logicNode: orLogicNode([
        likeFullFilterNode('ddEnum.className', stringFilterParam(searchValue)),
        likeFullFilterNode(
          'ddEnum.displayName',
          stringFilterParam(searchValue),
        ),
      ])(),
    };
    const enums = await ComponentDesignAPI.getCompEnums(enumCond);
    return {
      searchValue,
      entities,
      enums,
    };
  },
);

export const addComponentModule = createAsyncThunk(
  `/addComponentModule`,
  async (params: TComponentModule, thunkAPI) => {
    const saveCompModule: TComponentModule =
      await ComponentTreeAPI.addComponentModule(params);
    return saveCompModule;
  },
);

export const updateComponentModule = createAsyncThunk(
  `/updateComponentModule`,
  async (params: TComponentModule, thunkAPI) => {
    const saveCompModule: TComponentModule =
      await ComponentTreeAPI.updateComponentModule(params);
    return saveCompModule;
  },
);

export const removeComponentModule = createAsyncThunk(
  `/removeComponentModule`,
  async (params: TComponentModule, thunkAPI) => {
    await ComponentTreeAPI.deleteComponentModule(params);
    return params;
  },
);

export const addComponent = createAsyncThunk(
  `/addComponent`,
  async (params: TComponentEntityCollection, thunkAPI) => {
    const result: TComponentSaveResult =
      await ComponentTreeAPI.saveComponentEntityCollection(params);
    if (result.status !== 0) {
      message.error(result.message);
    }
    return result;
  },
);

export const removeComponent = createAsyncThunk(
  `/removeComponent`,
  async (params: TComponentEntityCollection, thunkAPI) => {
    const result: TComponentSaveResult =
      await ComponentTreeAPI.removeComponentEntityCollection(params);
    if (result.status !== 0) {
      message.error(result.message);
    }
    const myResult = { ...result, data: params };
    return myResult;
  },
);
