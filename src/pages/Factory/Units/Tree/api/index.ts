import * as API from '@/api';
import { TPageInfo, TPageInfoInput } from '@/models';
import { TTreeConf } from '@/pages/Factory/Units/Tree/model';

const ModuleAPI = {
  getById: (id?: string) => {
    return API.GET(`/tree/getById/${id}`);
  },
  add: (params: TTreeConf) => {
    return API.POST(`/tree/add`, params);
  },
  update: (params: TTreeConf) => {
    return API.POST(`/tree/update`, params);
  },
  get: (params: TPageInfoInput): Promise<TPageInfo<TTreeConf>> => {
    return API.POST(`/tree/aqPage`, params);
  },
  delete: (params: TTreeConf) => {
    return API.POST(`/tree/remove`, params);
  },
};

export default ModuleAPI;
