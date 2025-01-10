import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import { TToken } from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/token/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/token/getById/${id}`);
  },
  batchRemove: (params: TToken[]) => {
    return API.POST(`/token/batchRemove`, params);
  },
};

export default ListAPI;
