import ModuleAPI from '@/pages/Factory/Units/Form/api';
import {
  TBillForm,
  TBillFormContent,
  TTableBillFormConfigList,
  TTableBillFormField,
} from '@/pages/Factory/Units/Form/model';
import { TableColumnType } from 'antd';

type TTableMap = {
  mainProperty: string;
  tabCode: string;
  tabName: string;
  tableConf: {
    columns: TableColumnType<any>[];
    dataSource: any[];
  };
};

export const getConf = async (idBillform: string) => {
  const q: TBillForm = await ModuleAPI.getById(idBillform);
  if (!q.content) {
    return;
  }
  const qc: TBillFormContent = JSON.parse(q.content);
  const conf = qc.configList;
  const mainTableConfMap = getMainTableMap(conf);
  const subTableConfMap = getSubTableMap(conf);
  return { conf, mainTableConfMap, subTableConfMap };
};

export const getMainTableMap = (configList?: TTableBillFormConfigList) => {
  const result: { [x in string]: TTableMap } = {};
  if (!configList?.header || configList?.header?.length === 0) {
    return result;
  }
  configList?.header.forEach((b) => {
    const billFormFields = b.billFormFields || [];
    result[b.tabCode!] = {
      mainProperty: b.mainProperty!,
      tabCode: b.tabCode!,
      tabName: b.tabName!,
      tableConf: getTableConf(billFormFields),
    };
  });
  return result;
};

export const getSubTableMap = (configList?: TTableBillFormConfigList) => {
  const result: { [x in string]: TTableMap } = {};
  if (!configList?.body || configList?.body?.length === 0) {
    return result;
  }
  configList?.body.forEach((b) => {
    const billFormFields = b.billFormFields || [];
    result[b.tabCode!] = {
      mainProperty: b.mainProperty!,
      tabCode: b.tabCode!,
      tabName: b.tabName!,
      tableConf: getTableConf(billFormFields),
    };
  });
  return result;
};

const getTableConf = (billFormFields: TTableBillFormField[]) => {
  const columns: TableColumnType<any>[] = [];
  const dataSource: any[] = [];
  billFormFields?.map((b) => {
    columns.push({
      width: 150,
      title: b.displayName,
      dataIndex: b.name,
      key: b.name,
      render: (_dom: any, record: any) => {
        return <>{record[b.name!] ? record[b.name!] : '--'}</>;
      },
    });
  });
  const randomNum = Math.floor(Math.random() * 5);
  for (let i = 0; i < randomNum; i++) {
    const data: any = {};
    billFormFields?.map((b) => {
      data[b.name!] = b.displayName + '_' + i;
    });
    dataSource.push(data);
  }
  return { columns, dataSource };
};
