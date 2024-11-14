import * as API from '@/api';
import { TCondition } from '@/models';
import { TSimpleDtoEntityCollection, TDtoModule } from '../models';

const ComponentDTOTreeAPI = {
  entityProjectTree: (params?: TCondition) => {
    return API.POST('/project/entityCollectionAq', params);
  },
  dtoProjectTree: (params?: TCondition) => {
    return API.POST('/project/dtoCollectionAq', params);
  },
  dtoEntityCollectionSaveByAction: (
    params: Partial<TSimpleDtoEntityCollection>,
  ) => {
    return API.POST('/dtoEntityCollection/saveByAction', params);
  },
  dtoEntityCollectionRemove: (params: Partial<TSimpleDtoEntityCollection>) => {
    return API.POST('/dtoEntityCollection/removeOnErrorTip', params);
  },
  addDtoModule: (params: TDtoModule) => {
    return API.POST('/dtoModule/add', params);
  },
  updateDtoModule: (params: TDtoModule) => {
    return API.POST('/dtoModule/update', params);
  },
  deleteDtoModule: (params: TDtoModule) => {
    return API.POST('/dtoModule/remove', params);
  },
  getSimpleCollection: (params: { idEntityCollection: string }) => {
    return API.GET(`/entityCollection/getSimpleCollection`, params);
  },
  getEntities: (params: TCondition) => {
    return API.POST('/entity/aqDetail', params);
  },
  getEnums: (params: TCondition) => {
    return API.POST('/ddEnum/ed', params);
  },
};

export default ComponentDTOTreeAPI;
