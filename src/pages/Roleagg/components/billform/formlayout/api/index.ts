import * as API from '@/api';
import { TRole } from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/roleAgg/getById/${id}`);
  },
  add: (params: TRole) => {
    return API.POST(`/roleAgg/save`, params);
  },
  update: (params: TRole) => {
    return API.POST(`/roleAgg/save`, params);
  },
  remove: (params: TRole) => {
    return API.POST(`/roleAgg/remove`, params);
  },
};

export default FormAPI;
