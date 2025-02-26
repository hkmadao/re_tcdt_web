import { TQueryContent } from '@/models';

const queryConf: TQueryContent | undefined = {
  action: 1,
  componentModuleName: '公共属性',
  componentName: null,
  displayName: '数据类型',
  idComponent: '0000-115f0f9f-1acf-4113-9d63-534cedc06fe8',
  idComponentModule: '0000-ae91cf86-2dba-4906-8fbc-b5e35d71909a',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idQuery: '4C5vcely9fF66SZ1nST5Y',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'Attributetype',
  projectName: '模板代码设计工具RUST',
  subProjectName: '模型管理',
  searchRefs: [
    {
      idBillSearchRef: '933hilQp_iFCLbnzFu5wA',
      operatorCode: 'like',
      label: '数据类型编码',
      attributeName: 'code',
      searchAttributes: ['code'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: null,
      showOrder: 0,
    },
    {
      idBillSearchRef: 'rqDxsnStIUTdfgAmNid87',
      operatorCode: 'like',
      label: '显示名称',
      attributeName: 'displayName',
      searchAttributes: ['displayName'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: null,
      showOrder: 1,
    },
    {
      idBillSearchRef: 'XRn3-Ge_9vWokadpWnKRt',
      operatorCode: 'equal',
      label: '系统预置数据标识',
      attributeName: 'fgPreset',
      searchAttributes: ['fgPreset'],
      htmlInputType: 'Checkbox',
      valueType: 'Bool',
      defaultValue: false,
      showOrder: 2,
    },
  ],
};

export { queryConf };
