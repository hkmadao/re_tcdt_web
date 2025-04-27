import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import {
  TDeleteRefErrorMessage,
  TEntityCollection,
  TEntityCollectionSaveResult,
  TModuleStore,
} from '../models';
import DescriptDataAPI from '../api';
import { EnumConcreteDiagramType, moduleName } from '../conf';

export const fetchEntityCollection = createAsyncThunk(
  `/fetchs`,
  async (
    params: {
      id?: string;
      idElement?: string;
      concreteType?: EnumConcreteDiagramType;
    },
    thunkAPI,
  ) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleName];
    const { id, idElement, concreteType } = params;
    if (id === state.entityCollection.idEntityCollection) {
      return { fgCurrent: true, idElement, concreteType };
    }
    const collection: TEntityCollection =
      await DescriptDataAPI.getEntityCollectionById({ id: id! });
    return {
      fgCurrent: false,
      idElement,
      concreteType: concreteType ?? EnumConcreteDiagramType.PANEL,
      collection,
    };
  },
);

export const fetchFullCollection = createAsyncThunk(
  `/fetchFullCollection`,
  async (
    params: {
      id?: string;
    },
    thunkAPI,
  ) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleName];
    const { id } = params;
    const collection: TEntityCollection = await DescriptDataAPI.getFullColl({
      id: id!,
    });
    return {
      fgCurrent: false,
      idElement: undefined,
      concreteType: EnumConcreteDiagramType.PANEL,
      collection,
    };
  },
);

export const saveEntityCollection = createAsyncThunk(
  `/save`,
  async (params: TEntityCollection, { dispatch }) => {
    const saveResult: TEntityCollectionSaveResult =
      await DescriptDataAPI.entityCollectionSaveByAction(params);
    if (saveResult.status === 0) {
      return saveResult.data as TEntityCollection;
    } else {
      const errorMessages: TDeleteRefErrorMessage[] =
        saveResult.data as TDeleteRefErrorMessage[];
      const ems = errorMessages.map((em) => em.message);
      message.error(ems);
    }
  },
);
