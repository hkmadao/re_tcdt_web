import * as API from '@/api';
import { TUser } from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/userAgg/getById/${id}`);
  },
  add: (params: TUser) => {
    return API.POST(`/userAgg/save`, params);
  },
  update: (params: TUser) => {
    return API.POST(`/userAgg/save`, params);
  },
  remove: (params: TUser) => {
    return API.POST(`/userAgg/remove`, params);
  },
};

export default FormAPI;
