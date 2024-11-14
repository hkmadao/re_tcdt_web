import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import { TMenu } from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/menu/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/menu/extGetById/${id}`);
  },
  batchRemove: (params: TMenu[]) => {
    return API.POST(`/menu/batchRemove`, params);
  },
};

export default ListAPI;
