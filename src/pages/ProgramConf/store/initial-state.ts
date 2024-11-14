import { TCodeGenerateConfig, TDomainStore } from '../models';
export const initialState: TDomainStore = {
  status: 'idle',
  pageCode: 'list',
  data: {
    idCurrent: undefined,
    confDataList: [],
  },
};
