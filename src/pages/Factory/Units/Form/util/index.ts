import { firstToLower } from '@/util';
import { TBillFormUriConf, TTableBillFormUriConf } from '../model';

export * from './ref-util';

/**获取表格加载数据uri */
export const getTableBillFormUriConf = (
  className: string,
  billFormType: 'Single' | 'Combination',
) => {
  if (billFormType === 'Single') {
    const conf: TTableBillFormUriConf = {
      page: '/' + firstToLower(className) + '/aqPage',
      fetchById: '/' + firstToLower(className) + '/getById',
      batchRemove: '/' + firstToLower(className) + '/batchRemove',
    };
    return conf;
  }
  const conf: TTableBillFormUriConf = {
    page: '/' + firstToLower(className) + 'Agg/aqPage',
    fetchById: '/' + firstToLower(className) + 'Agg/getById',
    batchRemove: '/' + firstToLower(className) + 'Agg/batchRemove',
  };
  return conf;
};

/**获取表单加载数据uri */
export const getBillFormUriConf = (
  className: string,
  billFormType: 'Single' | 'Combination',
) => {
  if (billFormType === 'Single') {
    const conf: TBillFormUriConf = {
      fetchById: '/' + firstToLower(className) + '/getById',
      save: '/' + firstToLower(className) + '/add',
      update: '/' + firstToLower(className) + '/update',
      dataRemove: '/' + firstToLower(className) + '/remove',
    };
    return conf;
  }
  const conf: TBillFormUriConf = {
    fetchById: '/' + firstToLower(className) + 'Agg/getById',
    save: '/' + firstToLower(className) + 'Agg/save',
    update: '/' + firstToLower(className) + 'Agg/save',
    dataRemove: '/' + firstToLower(className) + 'Agg/remove',
  };
  return conf;
};
