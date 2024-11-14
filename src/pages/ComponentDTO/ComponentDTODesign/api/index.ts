import * as API from '@/api';
import { TCondition } from '@/models';
import { TDtoEntityCollection } from '../models';

const ComponentDTODesignAPI = {
  getEntitiesByEntityCollectionId: (params: {
    idDtoEntityCollection: string;
  }) => {
    return API.GET(
      `/dtoEntityCollection/getEntitiesByDtoEntityCollectionId`,
      params,
    );
  },
  dtoEntityCollectionSaveByAction: (params: Partial<TDtoEntityCollection>) => {
    return API.POST('/dtoEntityCollection/saveByAction', params);
  },
  dtoEntityCollectionRemove: (params: Partial<TDtoEntityCollection>) => {
    return API.POST('/dtoEntityCollection/removeOnErrorTip', params);
  },
  getDtoEntityCollectionById: (params: { id: string }) => {
    return API.GET(`/dtoEntityCollection/extGetById`, params);
  },
  getFullColl: (params: { id: string }) => {
    return API.GET(`/dtoEntityCollection/getFullColl`, params);
  },
  copyDtoEntityCollection: (params: { id: string }) => {
    return API.GET('/dtoEntityCollection/copyById', params);
  },
  joinEntities: (params: {
    entityCollection: TDtoEntityCollection;
    entityIds: string[];
    enumIds: string[];
  }) => {
    return API.POST('/dtoEntityCollection/joinEntities', params);
  },
  getDtoAttrByIds: (params: { idDtoEntityList: string }) => {
    return API.GET(`/dtoEntity/getDtoAttrByIds`, params);
  },
  getDtoEntities: (params: TCondition) => {
    return API.POST('/dtoEntity/aqDetail', params);
  },
  getDtoEnums: (params: TCondition) => {
    return API.POST('/dtoEnum/aqDetail', params);
  },
};

export default ComponentDTODesignAPI;
