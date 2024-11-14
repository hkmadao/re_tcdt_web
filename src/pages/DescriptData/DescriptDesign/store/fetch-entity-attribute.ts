import { createAsyncThunk } from '@reduxjs/toolkit';
import { TEntity } from '../models';
import API from '@/pages/DescriptData/DescriptDesign/api';
import { moduleName } from '../conf';

export const fetchEntityAttributes = createAsyncThunk(
  `${moduleName}/fetchEntityAttributes`,
  async (idEntities: string[]) => {
    const resEntities = await API.getDetailByEntityIds({
      idEntityList: idEntities.join(','),
    });
    if (resEntities) {
      const entities = resEntities.map((enti) => {
        return {
          ...enti,
          enumAssociates: undefined,
          implementAssociates: undefined,
          upAssociates: undefined,
          downAssociates: undefined,
        };
      });
      return entities;
    }
    return [];
  },
);

export const fetchOutEntityAttribute = createAsyncThunk(
  `${moduleName}/fetchOutEntityAttribute`,
  async (idEntity: string) => {
    const resEntity: TEntity = await API.getDetailByEntityId({ idEntity });
    return resEntity;
  },
);
