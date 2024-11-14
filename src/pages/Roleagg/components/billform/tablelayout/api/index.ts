import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import { TRole } from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/roleAgg/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/roleAgg/getById/${id}`);
  },
  batchRemove: (params: TRole[]) => {
    return API.POST(`/roleAgg/batchRemove`, params);
  },
};

export default ListAPI;
