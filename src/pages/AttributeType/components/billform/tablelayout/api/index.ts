import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import { TDataType } from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/dataType/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/dataType/getById/${id}`);
  },
  batchRemove: (params: TDataType[]) => {
    return API.POST(`/dataType/batchRemove`, params);
  },
};

export default ListAPI;
