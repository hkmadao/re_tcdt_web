import { TQueryContent } from '@/models';

const queryConf: TQueryContent | undefined = {
  action: 1,
  componentModuleName: '系统模块',
  componentName: null,
  displayName: '令牌',
  idComponent: '0m7OW2q0dEF7reUcjHqUN',
  idComponentModule: 'uFBamGsKfU3AwEHnqkH7E',
  idProject: 'HUo86fGpkXtIrqPKvjct0',
  idQuery: 'KnByfZoClTP2xp-rjihhG',
  idSubProject: '8JTsJB_8DgDd9eb__CfYT',
  name: 'Token',
  projectName: 'rtsp2rtmp',
  subProjectName: 'main',
  searchRefs: [
    {
      idBillSearchRef: '9r_OAveIq3mweFTYpM4ba',
      operatorCode: 'like',
      label: '用户名称',
      attributeName: 'username',
      searchAttributes: ['username'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: '',
      showOrder: 0,
    },
    {
      idBillSearchRef: 'cCT23WfFZfcUi_lMnPWNf',
      operatorCode: 'like',
      label: '昵称',
      attributeName: 'nickName',
      searchAttributes: ['nickName'],
      htmlInputType: 'Input',
      valueType: 'String',
      defaultValue: '',
      showOrder: 1,
    },
  ],
};

export { queryConf };
