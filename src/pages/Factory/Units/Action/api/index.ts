import * as API from '@/api';
import { TPageInfoInput, TPageInfo } from '@/models';
import { TAction } from '../model';

const ModuleAPI = {
  getById: (id?: string): Promise<TAction> => {
    return API.GET(`/buttonAction/getById/${id}`);
  },
  addAction: (params: TAction): Promise<TAction> => {
    return API.POST(`/buttonAction/add`, params);
  },
  updateAction: (params: TAction): Promise<TAction> => {
    return API.POST(`/buttonAction/update`, params);
  },
  getAction: (params: TPageInfoInput): Promise<TPageInfo<TAction>> => {
    return API.POST(`/buttonAction/aqPage`, params);
  },
  deleteAction: (params: TAction) => {
    return API.POST(`/buttonAction/remove`, params);
  },
};

export default ModuleAPI;
