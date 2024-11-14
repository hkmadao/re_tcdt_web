import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TSubProject,
  TProject,
  TSimpleEntityCollection,
  TTree,
} from '../models';
import DescriptTreeAPI from '../api';
import DescriptDataAPI from '../../DescriptDesign/api';
import {
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TcdtType,
  TCondition,
} from '@/models';
import { TEntityCollectionSaveResult } from '../../DescriptDesign/models';
import { message } from 'antd';

export const fetchEntityProjectTree = createAsyncThunk(
  `/fetchEntityProjectTree`,
  async () => {
    const treeArr: TTree[] = await DescriptTreeAPI.entityProjectTree();
    return treeArr;
  },
);

export const searchTreeNode = createAsyncThunk(
  `/searchTreeNode`,
  async (searchValue: string, thunkAPI) => {
    const entiCond: TCondition = {
      logicNode: orLogicNode([
        likeFullFilterNode('tableName', stringFilterParam(searchValue)),
        likeFullFilterNode('className', stringFilterParam(searchValue)),
        likeFullFilterNode('displayName', stringFilterParam(searchValue)),
      ])(),
    };
    const entities = await DescriptDataAPI.getEntities(entiCond);
    const enumCond: TCondition = {
      logicNode: orLogicNode([
        likeFullFilterNode('className', stringFilterParam(searchValue)),
        likeFullFilterNode('displayName', stringFilterParam(searchValue)),
      ])(),
    };
    const enums = await DescriptDataAPI.getEnums(enumCond);
    return {
      searchValue,
      entities,
      enums,
    };
  },
);

export const addProject = createAsyncThunk(
  `/addProject`,
  async (params: TProject, thunkAPI) => {
    const saveAfter: TProject = await DescriptTreeAPI.addProject(params);
    return saveAfter;
  },
);

export const updateProject = createAsyncThunk(
  `/updateProject`,
  async (params: TProject, thunkAPI) => {
    const saveAfter: TProject = await DescriptTreeAPI.updateProject(params);
    return saveAfter;
  },
);

export const removeProject = createAsyncThunk(
  `/removeProject`,
  async (params: TProject, thunkAPI) => {
    await DescriptTreeAPI.deleteProject(params);
    return params;
  },
);

export const addModule = createAsyncThunk(
  `/addModule`,
  async (params: TSubProject, thunkAPI) => {
    const saveCompModule: TSubProject = await DescriptTreeAPI.addModule(params);
    return saveCompModule;
  },
);

export const updateModule = createAsyncThunk(
  `/updateModule`,
  async (params: TSubProject, thunkAPI) => {
    const saveCompModule: TSubProject = await DescriptTreeAPI.updateModule(
      params,
    );
    return saveCompModule;
  },
);

export const removeModule = createAsyncThunk(
  `/removeModule`,
  async (params: TSubProject, thunkAPI) => {
    await DescriptTreeAPI.deleteModule(params);
    return params;
  },
);

export const addCollection = createAsyncThunk(
  `/addCollection`,
  async (params: TSimpleEntityCollection, thunkAPI) => {
    const result: TEntityCollectionSaveResult =
      await DescriptTreeAPI.entityCollectionSaveByAction(params);
    if (result.status !== 0) {
      message.error(result.message);
    }
    return result;
  },
);

export const removeCollection = createAsyncThunk(
  `/removeCollection`,
  async (params: TSimpleEntityCollection, thunkAPI) => {
    const result: TEntityCollectionSaveResult =
      await DescriptTreeAPI.entityCollectionSaveByAction(params);
    if (result.status !== 0) {
      message.error(result.message);
    }
    const myResult = { ...result, data: params };
    return myResult;
  },
);
