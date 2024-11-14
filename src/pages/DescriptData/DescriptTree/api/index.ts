import * as API from '@/api';
import { TCondition, TPageInfoInput } from '@/models';
import { TProject, TSubProject, TSimpleEntityCollection } from '../models';

const DescriptTreeAPI = {
  subProjectTree: (params?: TCondition) => {
    return API.POST('/project/subProjectAq', params);
  },
  entityProjectTree: (params?: TCondition) => {
    return API.POST('/project/entityCollectionAq', params);
  },
  addProject: (params: TProject) => {
    return API.POST('/project/add', params);
  },
  updateProject: (params: TProject) => {
    return API.POST('/project/update', params);
  },
  deleteProject: (params: TProject) => {
    return API.POST('/project/remove', params);
  },
  addModule: (params: TSubProject) => {
    return API.POST('/subProject/add', params);
  },
  updateModule: (params: TSubProject) => {
    return API.POST('/subProject/update', params);
  },
  deleteModule: (params: TSubProject) => {
    return API.POST('/subProject/remove', params);
  },
  getSimpleCollection: (params: { idEntityCollection: string }) => {
    return API.GET(`/entityCollection/getSimpleCollection`, params);
  },
  entityCollectionSaveByAction: (params: Partial<TSimpleEntityCollection>) => {
    return API.POST('/entityCollection/saveByAction', params);
  },
  entityCollectionRemove: (params: Partial<TSimpleEntityCollection>) => {
    return API.POST('/entityCollection/removeOnErrorTip', params);
  },
};

export default DescriptTreeAPI;
