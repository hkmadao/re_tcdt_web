import { TQueryContent } from '@/models';

const queryConf: TQueryContent | undefined = {
  action: 1,
  componentModuleName: '系统模块',
  componentName: null,
  displayName: '系统用户聚合查询',
  idComponent: '7rMPYMEiFYWA5tnZcqYUX',
  idComponentModule: 'NUWZLV-HXSQY7up9bY58k',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idQuery: 'Wa8ghERQ2_vSliiwGmPTp',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'UserAggQuery',
  projectName: '模板代码设计工具RUST',
  subProjectName: '模型管理',
  searchRefs: [
    {
      idBillSearchRef: '9BCQuBuwB6VbC6FjjLfi0',
      operatorCode: 'like',
      label: '登录账号 ',
      attributeName: 'account',
      searchAttributes: ['account'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: null,
      showOrder: 0,
    },
    {
      idBillSearchRef: 'T4qfNoIBH_ixc92HAxzy-',
      operatorCode: 'like',
      label: '昵称',
      attributeName: 'nickName',
      searchAttributes: ['nickName'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: null,
      showOrder: 1,
    },
    {
      idBillSearchRef: 'VvsEXhuMll4HZV-2WV9gC',
      operatorCode: 'equal',
      label: '启用标志',
      attributeName: 'fgActive',
      searchAttributes: ['fgActive'],
      htmlInputType: 'Checkbox',
      valueType: 'Bool',
      defaultValue: true,
      showOrder: 2,
    },
  ],
};

export { queryConf };
