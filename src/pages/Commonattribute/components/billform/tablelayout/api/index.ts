import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import { TCommonAttribute } from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/commonAttribute/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/commonAttribute/getById/${id}`);
  },
  batchRemove: (params: TCommonAttribute[]) => {
    return API.POST(`/commonAttribute/batchRemove`, params);
  },
};

export default ListAPI;
