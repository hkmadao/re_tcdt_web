import { TBillFormContent } from '@/models';

const tableConf: TBillFormContent | undefined = {
  action: 1,
  billFormType: 'Single',
  componentModuleName: '系统模块',
  componentName: '令牌',
  displayName: '令牌',
  idBillForm: 'NHfdRpJHAn5SVzWt5svPq',
  idComponent: '0m7OW2q0dEF7reUcjHqUN',
  idComponentModule: 'uFBamGsKfU3AwEHnqkH7E',
  idProject: 'HUo86fGpkXtIrqPKvjct0',
  idSubProject: '8JTsJB_8DgDd9eb__CfYT',
  name: 'Token',
  projectName: 'rtsp2rtmp',
  subProjectName: 'main',
  configList: {
    idBillForm: '2-2dbG0zketUtUePwTtiV',
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: 'KQk56JiQ3ISw8U2xR-sss',
        tabCode: 'token',
        tabName: '令牌',
        tabIndex: 0,
        billFormFields: [
          {
            idBillFormField: 'vctI8VO9fc7ewl-dhcoCk',
            name: 'idSysToken',
            displayName: '令牌主属性',
            fgMainProperty: true,
            showOrder: 0,
            readonly: false,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'Yh2Oq13syKi1uH5fz4deg',
            name: 'username',
            displayName: '用户名称',
            fgMainProperty: false,
            showOrder: 1,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '56rEiAFoIxOg3hQYAH7Um',
            name: 'nickName',
            displayName: '昵称',
            fgMainProperty: false,
            showOrder: 2,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'b23DlMsQa3uPcPaop5NDS',
            name: 'createTime',
            displayName: '创建时间',
            fgMainProperty: false,
            showOrder: 3,
            readonly: false,
            dataType: 'DateTime',
            inputType: 'DateTime',
            fgDisplay: true,
          },
          {
            idBillFormField: 'ikJG-pqkhMkS5nzxm5Vgt',
            name: 'token',
            displayName: '令牌',
            fgMainProperty: false,
            showOrder: 4,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'bEJgZaHQ8vyfEZU-SI-ml',
            name: 'expiredTime',
            displayName: '过期时间',
            fgMainProperty: false,
            showOrder: 5,
            readonly: false,
            dataType: 'DateTime',
            inputType: 'DateTime',
            fgDisplay: true,
          },
          {
            idBillFormField: '9OJz82hMitch-PuMXeU16',
            name: 'userInfoString',
            displayName: '用户信息序列化',
            fgMainProperty: false,
            showOrder: 6,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
        ],
        metadataAttrName: 'token',
        firstUpperTabCode: 'Token',
        tabClassName: 'Token',
        firstLowerTabClassName: 'token',
        tabAttrName: 'token',
        firstUpperTabAttrName: 'Token',
        mainProperty: 'idSysToken',
        refType: 'Single',
        orderProperty: 'idSysToken',
        orderType: 'ASC',
      },
    ],
    body: [],
    tail: [],
    uriConf: {
      page: '/token/aqPage',
      fetchById: '/token/getById',
      batchRemove: '/token/batchRemove',
    },
  },
  configForm: {
    idBillForm: '2Qj0z9lXhHpX4LhVts5tH',
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: 'ZdJbtSavqEjhTu_JospF8',
        tabCode: 'defaulttab',
        tabName: '默认页签',
        tabIndex: 0,
        billFormFields: [],
      },
    ],
    body: [],
    tail: [],
    uriConf: {
      fetchById: '/token/getById',
      save: '/token/add',
      update: '/token/update',
      dataRemove: '/token/remove',
    },
  },
};

export { tableConf };
