import * as API from '@/api';
import { TCommonAttribute } from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/commonAttribute/getById/${id}`);
  },
  add: (params: TCommonAttribute) => {
    return API.POST(`/commonAttribute/add`, params);
  },
  update: (params: TCommonAttribute) => {
    return API.POST(`/commonAttribute/update`, params);
  },
  remove: (params: TCommonAttribute) => {
    return API.POST(`/commonAttribute/remove`, params);
  },
};

export default FormAPI;
