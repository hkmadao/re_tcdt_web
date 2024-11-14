import * as API from '@/api';
import { TCondition } from '@/models';
import { TComponentModule, TComponentEntityCollection } from '../models';

const ComponentTreeAPI = {
  componentProjectTree: (params?: TCondition) => {
    return API.POST('/project/componentAq', params);
  },
  addComponentModule: (params: TComponentModule) => {
    return API.POST('/componentModule/add', params);
  },
  updateComponentModule: (params: TComponentModule) => {
    return API.POST('/componentModule/update', params);
  },
  deleteComponentModule: (params: TComponentModule) => {
    return API.POST('/componentModule/remove', params);
  },
  saveComponentEntityCollection: (params: TComponentEntityCollection) => {
    return API.POST('/component/saveByAction', params);
  },
  removeComponentEntityCollection: (params: TComponentEntityCollection) => {
    return API.POST('/component/removeOnErrorTip', params);
  },
  getDetailByEntityId: (params: { idEntity: string }) => {
    return API.GET(`/entity/getDetailByEntityId`, params);
  },
  getDetailByEnumIds: (params: { idEnumList: string }) => {
    return API.GET(`/ddEnum/getDetailByEnumIds`, params);
  },
};

export default ComponentTreeAPI;
