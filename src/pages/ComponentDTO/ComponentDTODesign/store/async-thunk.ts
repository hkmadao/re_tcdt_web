import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import {
  TDeleteRefErrorMessage,
  TDtoEntityCollection,
  TDtoEntityCollectionSaveResult,
  TModuleStore,
} from '../models';
import ComponentDTODesignAPI from '../api';
import { EnumConcreteDiagramType, moduleName } from '../conf';
import {
  andLogicNode,
  inFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';
import { TEntity, TEnum } from '../../ComponentDTOTree/models';
import TreeAPI from '@/pages/ComponentDTO/ComponentDTOTree/api';

export const fetchEntityCollection = createAsyncThunk(
  `/fetchs`,
  async (
    params: {
      id: string;
      idElement?: string;
      concreteType?: EnumConcreteDiagramType;
    },
    thunkAPI,
  ) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleName];
    const { id, idElement, concreteType } = params;
    if (id === state.dtoCollection.idDtoEntityCollection) {
      return { fgCurrent: true, idElement, concreteType };
    }
    const collection: TDtoEntityCollection =
      await ComponentDTODesignAPI.getDtoEntityCollectionById({
        id: id!,
      });
    return {
      fgCurrent: false,
      idElement,
      concreteType: concreteType ?? EnumConcreteDiagramType.PANEL,
      collection,
    };
  },
);

export const saveEntityCollection = createAsyncThunk(
  `/save`,
  async (params: TDtoEntityCollection, { dispatch }) => {
    const saveResult: TDtoEntityCollectionSaveResult =
      await ComponentDTODesignAPI.dtoEntityCollectionSaveByAction(params);
    if (saveResult.status === 0) {
      return saveResult.data as TDtoEntityCollection;
    } else {
      const errorMessages: TDeleteRefErrorMessage[] =
        saveResult.data as TDeleteRefErrorMessage[];
      const ems = errorMessages.map((em) => em.message);
      message.error(ems);
    }
  },
);

export const fetchEntites = createAsyncThunk(
  `/fetchEntites`,
  async (reIds: string[]) => {
    const params: TCondition = {
      logicNode: andLogicNode([
        inFilterNode(
          'idEntity',
          reIds.map((id) => stringFilterParam(id)),
        ),
      ])(),
    };
    const entities: TEntity[] = await TreeAPI.getEntities(params);
    return entities;
  },
);

export const fetchEnums = createAsyncThunk(
  `/fetchEnums`,
  async (reIds: string[]) => {
    const params: TCondition = {
      logicNode: andLogicNode([
        inFilterNode(
          'idEnum',
          reIds.map((id) => stringFilterParam(id)),
        ),
      ])(),
    };
    const enums: TEnum[] = await TreeAPI.getEnums(params);
    return enums;
  },
);
