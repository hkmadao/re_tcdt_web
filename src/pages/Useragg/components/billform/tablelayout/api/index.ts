import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import { TUser } from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/userAgg/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/userAgg/getById/${id}`);
  },
  batchRemove: (params: TUser[]) => {
    return API.POST(`/userAgg/batchRemove`, params);
  },
};

export default ListAPI;
