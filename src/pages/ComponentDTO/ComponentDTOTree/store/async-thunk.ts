import { createAsyncThunk } from '@reduxjs/toolkit';
import { TDtoModule, TSimpleDtoEntityCollection, TTree } from '../models';
import ComponentDTOTreeAPI from '../api';
import {
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TcdtType,
  TCondition,
} from '@/models';
import ComponentDTODesignAPI from '../../ComponentDTODesign/api';
import { TDtoEntityCollectionSaveResult } from '../../ComponentDTODesign/models';
import { message } from 'antd';

export const fetchDtoProjectTree = createAsyncThunk(
  `/fetchDtoProjectTree`,
  async () => {
    const treeArr: TTree[] = await ComponentDTOTreeAPI.dtoProjectTree();
    return treeArr;
  },
);

export const searchTreeNode = createAsyncThunk(
  `/searchTreeNode`,
  async (searchValue: string, thunkAPI) => {
    const entiCond: TCondition = {
      logicNode: orLogicNode([
        likeFullFilterNode('className', stringFilterParam(searchValue)),
        likeFullFilterNode('displayName', stringFilterParam(searchValue)),
      ])(),
    };
    const entities = await ComponentDTODesignAPI.getDtoEntities(entiCond);
    const enumCond: TCondition = {
      logicNode: orLogicNode([
        likeFullFilterNode('className', stringFilterParam(searchValue)),
        likeFullFilterNode('displayName', stringFilterParam(searchValue)),
      ])(),
    };
    const enums = await ComponentDTODesignAPI.getDtoEnums(enumCond);
    return {
      searchValue,
      entities,
      enums,
    };
  },
);

export const addDtoModule = createAsyncThunk(
  `/addDtoModule`,
  async (params: TDtoModule, thunkAPI) => {
    const saveCompModule: TDtoModule = await ComponentDTOTreeAPI.addDtoModule(
      params,
    );
    return saveCompModule;
  },
);

export const updateDtoModule = createAsyncThunk(
  `/updateDtoModule`,
  async (params: TDtoModule, thunkAPI) => {
    const saveCompModule: TDtoModule =
      await ComponentDTOTreeAPI.updateDtoModule(params);
    return saveCompModule;
  },
);

export const removeDtoModule = createAsyncThunk(
  `/removeDtoModule`,
  async (params: TDtoModule, thunkAPI) => {
    await ComponentDTOTreeAPI.deleteDtoModule(params);
    return params;
  },
);

export const addCollection = createAsyncThunk(
  `/addCollection`,
  async (params: TSimpleDtoEntityCollection, thunkAPI) => {
    const result: TDtoEntityCollectionSaveResult =
      await ComponentDTOTreeAPI.dtoEntityCollectionSaveByAction(params);
    if (result.status !== 0) {
      message.error(result.message);
    }
    return result;
  },
);

export const removeCollection = createAsyncThunk(
  `/removeCollection`,
  async (params: TSimpleDtoEntityCollection, thunkAPI) => {
    const result: TDtoEntityCollectionSaveResult =
      await ComponentDTOTreeAPI.dtoEntityCollectionSaveByAction(params);
    if (result.status !== 0) {
      message.error(result.message);
    }
    const myResult = { ...result, data: params };
    return myResult;
  },
);
