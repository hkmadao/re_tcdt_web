import * as API from '@/api';
import { TDataType } from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/dataType/getById/${id}`);
  },
  add: (params: TDataType) => {
    return API.POST(`/dataType/add`, params);
  },
  update: (params: TDataType) => {
    return API.POST(`/dataType/update`, params);
  },
  remove: (params: TDataType) => {
    return API.POST(`/dataType/remove`, params);
  },
};

export default FormAPI;
