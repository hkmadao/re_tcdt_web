import * as API from '@/api';
import { TMenu } from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/menu/extGetById/${id}`);
  },
  add: (params: TMenu) => {
    return API.POST(`/menu/add`, params);
  },
  update: (params: TMenu) => {
    return API.POST(`/menu/update`, params);
  },
  remove: (params: TMenu) => {
    return API.POST(`/menu/remove`, params);
  },
};

export default FormAPI;
