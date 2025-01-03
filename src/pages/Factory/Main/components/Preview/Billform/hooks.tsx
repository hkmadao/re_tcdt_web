import ModuleAPI from '@/pages/Factory/Units/Form/api';
import {
  TBillForm,
  TBillFormConfigForm,
  TBillFormContent,
  TTableBillFormField,
} from '@/pages/Factory/Units/Form/model';
import { Form, Input, TableColumnType } from 'antd';
import { ReactNode } from 'react';

type TTableMap = {
  mainProperty: string;
  tabCode: string;
  tabName: string;
  tableConf: {
    columns: TableColumnType<any>[];
    dataSource: any[];
  };
};

type TFormMap = {
  mainProperty: string;
  tabCode: string;
  tabName: string;
  nodes: ReactNode[];
};

export const getConf = async (idBillform: string) => {
  const billForm: TBillForm = await ModuleAPI.getById(idBillform);
  if (!billForm.content) {
    return;
  }
  const billFormContent: TBillFormContent = JSON.parse(billForm.content);
  const conf = billFormContent.configForm;
  const formMap = getFormMap(conf);
  const subTableConfMap = getSubTableMap(conf);
  return { conf, formMap, subTableConfMap };
};

export const getFormMap = (configForm?: TBillFormConfigForm) => {
  const result: { [x in string]: TFormMap } = {};
  if (!configForm?.header || configForm?.header?.length === 0) {
    return result;
  }
  configForm?.header.forEach((b) => {
    const billFormFields = b.billFormFields || [];
    result[b.tabCode!] = {
      mainProperty: b.mainProperty!,
      tabCode: b.tabCode!,
      tabName: b.tabName!,
      nodes: getFormConf(billFormFields),
    };
  });
  return result;
};

const getFormConf = (billFormFields: TTableBillFormField[]) => {
  const nodes: ReactNode[] = [];
  billFormFields?.map((b) => {
    nodes.push(
      <Form.Item
        key={b.name}
        label={b.displayName}
        name={b.name}
        style={{ padding: '5px 0px 5px 0px' }}
        hidden={b.fgDisplay ? undefined : true}
      >
        <Input allowClear placeholder={'请输入' + b.displayName} />
      </Form.Item>,
    );
  });
  return nodes;
};

export const getSubTableMap = (configForm?: TBillFormConfigForm) => {
  const result: { [x in string]: TTableMap } = {};
  if (!configForm?.body || configForm?.body?.length === 0) {
    return result;
  }
  configForm?.body.forEach((b) => {
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
