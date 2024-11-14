import * as API from '@/api';
import { TCondition } from '@/models';
import { TEntity, TEntityCollection, TEnum } from '../models';

const DescriptDataAPI = {
  getSimpleCollection: (params: { idEntityCollection: string }) => {
    return API.GET(`/entityCollection/getSimpleCollection`, params);
  },
  getEntityCollectionById: (params: { id: string }) => {
    return API.GET(`/entityCollection/extGetById`, params);
  },
  getFullColl: (params: { id: string }) => {
    return API.GET(`/entityCollection/getFullColl`, params);
  },
  entityCollectionSaveByAction: (params: Partial<TEntityCollection>) => {
    return API.POST('/entityCollection/saveByAction', params);
  },
  entityCollectionRemove: (params: Partial<TEntityCollection>) => {
    return API.POST('/entityCollection/removeOnErrorTip', params);
  },
  joinEntities: (params: {
    entityCollection: TEntityCollection;
    entityIds: string[];
    enumIds: string[];
  }) => {
    return API.POST('/entityCollection/joinEntities', params);
  },
  copyEntityCollection: (params: { id: string }) => {
    return API.GET('/entityCollection/copyById', params);
  },
  getDetailByEntityId: (params: { idEntity: string }): Promise<TEntity> => {
    return API.GET(`/entity/getDetailByEntityId`, params);
  },
  getDetailByEntityIds: (params: {
    idEntityList: string;
  }): Promise<TEntity[]> => {
    return API.GET(`/entity/getDetailByEntityIds`, params);
  },
  getEntities: (params: TCondition): Promise<TEntity[]> => {
    return API.POST('/entity/aqDetail', params);
  },
  getEnums: (params: TCondition) => {
    return API.POST('/ddEnum/aqDetail', params);
  },
  getDetailByEnumIds: (params: { idEnumList: string }): Promise<TEnum[]> => {
    return API.GET(`/ddEnum/getDetailByEnumIds`, params);
  },
};

export default DescriptDataAPI;
