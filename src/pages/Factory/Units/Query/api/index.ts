import * as API from '@/api';
import { TCondition, TPageInfoInput } from '@/models';
import { TQuery } from '@/pages/Factory/Units/Query/model';

const ModuleAPI = {
  getById: (id?: string) => {
    return API.GET(`/query/getById/${id}`);
  },
  addBillForm: (params: TQuery) => {
    return API.POST(`/query/add`, params);
  },
  updateBillForm: (params: TQuery) => {
    return API.POST(`/query/update`, params);
  },
  getBillForm: (params: TPageInfoInput) => {
    return API.POST(`/query/aqPage`, params);
  },
  deleteBillForm: (params: TQuery) => {
    return API.POST(`/query/remove`, params);
  },
};

export default ModuleAPI;
