import { TQueryContent } from '@/models';

const queryConf: TQueryContent | undefined = {
  action: 1,
  componentModuleName: '公共属性',
  componentName: null,
  displayName: '公共属性',
  idComponent: '0000-d711b775-a2b9-4028-b714-1f7664b310a8',
  idComponentModule: '0000-ae91cf86-2dba-4906-8fbc-b5e35d71909a',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idQuery: 'xNtwVTHuZJRvSowg54GiN',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'Commonattribute',
  projectName: '模板代码设计工具RUST',
  subProjectName: '模型管理',
  searchRefs: [
    {
      idBillSearchRef: 'EaPU7v9BfDUQz0iVxg6Ht',
      operatorCode: 'like',
      label: '名称',
      attributeName: 'attributeName',
      searchAttributes: ['attributeName', 'displayName', 'columnName'],
      htmlInputType: 'Input',
      valueType: 'String',
      showOrder: 0,
      defaultValue: null,
    },
    {
      idBillSearchRef: 'Je0zNzu3TdyM-ougSKXzd',
      operatorCode: 'equal',
      label: '序号',
      attributeName: 'sn',
      searchAttributes: ['sn'],
      htmlInputType: 'InputNumber',
      valueType: 'String',
      showOrder: 1,
      defaultValue: '',
    },
    {
      idBillSearchRef: 'UKCUtm4X75DUdH1npuB_P',
      operatorCode: 'equal',
      label: '系统预置数据标识',
      attributeName: 'fgPreset',
      searchAttributes: ['fgPreset'],
      htmlInputType: 'Checkbox',
      valueType: 'Bool',
      showOrder: 2,
      defaultValue: false,
    },
  ],
};

export { queryConf };
