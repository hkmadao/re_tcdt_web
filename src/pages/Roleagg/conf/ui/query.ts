import { TQueryContent } from '@/models';

const queryConf: TQueryContent | undefined = {
  action: 1,
  componentModuleName: '系统模块',
  componentName: null,
  displayName: '角色聚合',
  idComponent: 'Ms8xR9sTSIJ0upXYCAarw',
  idComponentModule: 'NUWZLV-HXSQY7up9bY58k',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idQuery: 'BBs-iDDb8ZmZYLgNmA0qO',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'Roleagg',
  projectName: '模板代码设计工具RUST',
  subProjectName: '模型管理',
  searchRefs: [
    {
      idBillSearchRef: 'DCSM0M70QNrwZLcIUueaa',
      operatorCode: 'like',
      label: '名称',
      attributeName: 'name',
      searchAttributes: ['name'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: '',
      showOrder: 0,
    },
    {
      idBillSearchRef: 'eIKhFxpO8SkGt4Tlya1ip',
      operatorCode: 'like',
      label: '显示名称',
      attributeName: 'displayName',
      searchAttributes: ['displayName'],
      htmlInputType: 'Input',
      valueType: 'String',
      showOrder: 1,
      defaultValue: null,
    },
  ],
};

export { queryConf };
