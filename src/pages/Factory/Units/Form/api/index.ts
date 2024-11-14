import * as API from '@/api';
import { TPageInfo, TPageInfoInput } from '@/models';
import { TBillForm } from '@/pages/Factory/Units/Form/model';

const ModuleAPI = {
  getById: (id?: string): Promise<TBillForm> => {
    return API.GET(`/billForm/getById/${id}`);
  },
  addBillForm: (params: TBillForm): Promise<TBillForm> => {
    return API.POST(`/billForm/add`, params);
  },
  updateBillForm: (params: TBillForm): Promise<TBillForm> => {
    return API.POST(`/billForm/update`, params);
  },
  getBillForm: (params: TPageInfoInput): Promise<TPageInfo<TBillForm>> => {
    return API.POST(`/billForm/aqPage`, params);
  },
  deleteBillForm: (params: TBillForm): Promise<void> => {
    return API.POST(`/billForm/remove`, params);
  },
};

export default ModuleAPI;
