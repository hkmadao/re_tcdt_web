import * as API from '@/api';
import { TCondition, TPageInfoInput } from '@/models';
import { TUiFactory } from '@/pages/Factory/Main/model';

const ModuleAPI = {
  getById: (id?: string) => {
    return API.GET(`/factory/getById/${id}`);
  },
  addUiFactory: (params: TUiFactory) => {
    return API.POST(`/factory/add`, params);
  },
  updateUiFactory: (params: TUiFactory) => {
    return API.POST(`/factory/update`, params);
  },
  getUiFactory: (params: TPageInfoInput) => {
    return API.POST(`/factory/aqPage`, params);
  },
  deleteUiFactory: (params: TUiFactory) => {
    return API.POST(`/factory/remove`, params);
  },
};

export default ModuleAPI;
