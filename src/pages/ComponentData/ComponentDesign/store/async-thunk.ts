import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import {
  TComponent,
  TComponentSaveResult,
  TDeleteRefErrorMessage,
  TModuleStore,
} from '../models';
import ComponentDesignAPI from '../api';
import { EnumConcreteDiagramType, moduleName } from '../conf';

export const fetchComponent = createAsyncThunk(
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
    if (id === state.component.idComponent) {
      return { fgCurrent: true, idElement, concreteType };
    }
    const collection: TComponent = await ComponentDesignAPI.getComponentById({
      idComponent: id!,
    });
    return {
      fgCurrent: false,
      idElement,
      concreteType: concreteType ?? EnumConcreteDiagramType.PANEL,
      collection,
    };
  },
);

export const saveComponent = createAsyncThunk(
  `/save`,
  async (params: TComponent) => {
    const saveResult: TComponentSaveResult =
      await ComponentDesignAPI.saveComponent(params);
    if (saveResult.status === 0) {
      return saveResult.data as TComponent;
    } else {
      const errorMessages: TDeleteRefErrorMessage[] =
        saveResult.data as TDeleteRefErrorMessage[];
      const ems = errorMessages.map((em) => em.message);
      message.error(ems);
    }
  },
);
