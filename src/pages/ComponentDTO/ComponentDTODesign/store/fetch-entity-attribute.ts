import { createAsyncThunk } from '@reduxjs/toolkit';
import { TDtoEntity } from '../models';
import API from '@/pages/ComponentDTO/ComponentDTODesign/api';
import { moduleName } from '../conf';

export const fetchEntityAttributes = createAsyncThunk(
  `${moduleName}/fetchEntityAttributes`,
  async (idDtoEntities: string[]) => {
    const resEntities: TDtoEntity[] = await API.getDtoAttrByIds({
      idDtoEntityList: idDtoEntities.join(','),
    });
    return resEntities;
  },
);
