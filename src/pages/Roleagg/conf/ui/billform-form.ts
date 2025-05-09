import { TBillFormContent } from '@/models';

const billformConf: TBillFormContent | undefined = {
  action: 1,
  billFormType: 'Combination',
  componentModuleName: '系统模块',
  componentName: '角色聚合',
  displayName: '角色聚合',
  idBillForm: 'yj4t1nE1BnFtmIHw0bC8k',
  idComponent: 'Ms8xR9sTSIJ0upXYCAarw',
  idComponentModule: 'NUWZLV-HXSQY7up9bY58k',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'Roleagg',
  projectName: '模板代码设计工具RUST',
  subProjectName: '模型管理',
  configList: {
    idBillForm: '7Pz0gwTtaid5D5o1PSgkU',
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: 's2CDTd_wszzd8dWsRrCaP',
        tabCode: 'role',
        tabName: '角色',
        tabIndex: 0,
        billFormFields: [
          {
            idBillFormField: 'GGrrZf7gdkLCnYXs6_XRh',
            name: 'idRole',
            displayName: '角色id',
            fgMainProperty: true,
            showOrder: 0,
            readonly: false,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
            placeholder: '角色id',
          },
          {
            idBillFormField: 'MzDZyqEzIOo6uwSxsAPco',
            name: 'name',
            displayName: '名称',
            fgMainProperty: false,
            showOrder: 1,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
            placeholder: '名称',
          },
          {
            idBillFormField: 'RutexnzMyxBR9eh0-0UXA',
            name: 'displayName',
            displayName: '显示名称',
            fgMainProperty: false,
            showOrder: 2,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
            placeholder: '显示名称',
          },
        ],
        metadataAttrName: 'role',
        firstUpperTabCode: 'Role',
        fgDefaultTab: true,
        tabClassName: 'Role',
        firstLowerTabClassName: 'role',
        tabAttrName: 'role',
        firstUpperTabAttrName: 'Role',
        mainProperty: 'idRole',
        refType: 'Single',
        orderProperty: 'idRole',
        orderType: 'ASC',
        orderInfoList: [
          {
            idOrderInfo: 'ocj2JqV0JDaFWh7ojrghK',
            orderProperty: 'name',
            orderType: 'ASC',
          },
        ],
      },
    ],
    body: [
      {
        idAttribute: '6MfQXP4dm5KFbkX4f4_ay',
        tabClassName: 'UserRole',
        firstLowerTabClassName: 'userRole',
        tabAttrName: 'userRoles',
        firstUpperTabAttrName: 'UserRoles',
        mainProperty: 'idSysUserRole',
        orderProperty: 'idSysUserRole',
        orderType: 'ASC',
        refType: 'Array',
        tabCode: 'userRoles',
        firstUpperTabCode: 'UserRoles',
        tabName: '用户',
        billFormFields: [
          {
            idBillFormField: 'zTHhPm7n_Fhn8OJFED6-H',
            name: 'idSysUserRole',
            displayName: '用户角色关系主属性',
            fgMainProperty: true,
            showOrder: 0,
            readonly: true,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
          {
            idBillFormField: 'WZBcDmVwsrLncY974wVS_',
            name: 'idUser',
            dataType: 'InternalRef',
            displayName: '系统用户',
            fgMainProperty: false,
            showOrder: 2,
            refAttributeName: 'user',
            readonly: false,
            inputType: 'Ref',
            refConfig: {
              idBillRef: 'Sub29eMIj53l3wFfuYIl9',
              refStyle: 'table',
              backWriteProp: 'idUser',
              displayProp: 'account',
              title: '系统用户',
              tableRef: {
                dataUri: '/user/aqPage',
                fgPage: true,
                tableMainProp: 'idUser',
                refColumns: [
                  {
                    idBillRefColumn: 'RqR8GvrEMJZxAyBBp7DLU',
                    name: 'phone',
                    displayName: '手机号码',
                  },
                  {
                    idBillRefColumn: 'UOdlpcQLpndTIbCTfhFCu',
                    name: 'name',
                    displayName: '姓名 ',
                  },
                ],
                ceDisplayName: '系统用户',
              },
            },
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
        ],
        idBillFormTab: '69_dd_t1bBpks0yOd0QGg',
        tabIndex: 0,
        metadataAttrName: 'userRoles',
        fgDefaultTab: true,
        orderInfoList: [
          {
            idOrderInfo: '3La1NV95mK7BdvBs52MOB',
            orderProperty: 'idSysUserRole',
            orderType: 'ASC',
          },
        ],
      },
      {
        idAttribute: 'oGOEobgJJjQbkfdfOBmDt',
        tabClassName: 'RoleMenu',
        firstLowerTabClassName: 'roleMenu',
        tabAttrName: 'roleMenus',
        firstUpperTabAttrName: 'RoleMenus',
        mainProperty: 'idRoleMenu',
        orderProperty: 'idRoleMenu',
        orderType: 'ASC',
        refType: 'Array',
        tabCode: 'roleMenus',
        firstUpperTabCode: 'RoleMenus',
        tabName: '菜单',
        billFormFields: [
          {
            idBillFormField: 'mINBfowVO_ue_9WkrDeB7',
            name: 'idRoleMenu',
            displayName: '角色与菜单id',
            fgMainProperty: true,
            showOrder: 0,
            readonly: true,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
          {
            idBillFormField: 'APno3M2iPDzy-nSsPRy1i',
            name: 'idMenu',
            dataType: 'InternalRef',
            displayName: '系统菜单',
            fgMainProperty: false,
            showOrder: 2,
            refAttributeName: 'menu',
            readonly: false,
            inputType: 'Ref',
            refConfig: {
              idBillRef: 'giTic0fpaPzqlE2CrpFs7',
              refStyle: 'table',
              backWriteProp: 'idMenu',
              displayProp: 'name',
              title: '系统菜单',
              tableRef: {
                dataUri: '/menu/aqPage',
                fgPage: true,
                tableMainProp: 'idMenu',
                refColumns: [
                  {
                    idBillRefColumn: 'iIztDbY92W0bAhix2s0BD',
                    name: 'fgActive',
                    displayName: '启用标志',
                  },
                  {
                    idBillRefColumn: 'bs1LcQVNZaNh8a5gFp7wx',
                    name: 'menuType',
                    displayName: '菜单类型',
                  },
                ],
                ceDisplayName: '系统菜单',
              },
            },
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
        ],
        idBillFormTab: 'Scn0M2fDQbHCzg4NTKaZr',
        tabIndex: 1,
        orderInfoList: [
          {
            idOrderInfo: 'RJscwBsLJxeIN330Lgg90',
            orderProperty: 'idRoleMenu',
            orderType: 'ASC',
          },
        ],
      },
    ],
    tail: [],
    uriConf: {
      page: '/roleAgg/aqPage',
      fetchById: '/roleAgg/getById',
      batchRemove: '/roleAgg/batchRemove',
    },
  },
  configForm: {
    idBillForm: '7Pz0gwTtaid5D5o1PSgkU',
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: 's2CDTd_wszzd8dWsRrCaP',
        tabCode: 'role',
        tabName: '角色',
        tabIndex: 0,
        billFormFields: [
          {
            idBillFormField: 'GGrrZf7gdkLCnYXs6_XRh',
            name: 'idRole',
            displayName: '角色id',
            fgMainProperty: true,
            showOrder: 0,
            readonly: false,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
            placeholder: '角色id',
          },
          {
            idBillFormField: 'MzDZyqEzIOo6uwSxsAPco',
            name: 'name',
            displayName: '名称',
            fgMainProperty: false,
            showOrder: 1,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
            placeholder: '名称',
          },
          {
            idBillFormField: 'RutexnzMyxBR9eh0-0UXA',
            name: 'displayName',
            displayName: '显示名称',
            fgMainProperty: false,
            showOrder: 2,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
            placeholder: '显示名称',
          },
        ],
        metadataAttrName: 'role',
        firstUpperTabCode: 'Role',
        fgDefaultTab: true,
        tabClassName: 'Role',
        firstLowerTabClassName: 'role',
        tabAttrName: 'role',
        firstUpperTabAttrName: 'Role',
        mainProperty: 'idRole',
        refType: 'Single',
        orderProperty: 'idRole',
        orderType: 'ASC',
        orderInfoList: [
          {
            idOrderInfo: 'ocj2JqV0JDaFWh7ojrghK',
            orderProperty: 'name',
            orderType: 'ASC',
          },
        ],
      },
    ],
    body: [
      {
        idAttribute: '6MfQXP4dm5KFbkX4f4_ay',
        tabClassName: 'UserRole',
        firstLowerTabClassName: 'userRole',
        tabAttrName: 'userRoles',
        firstUpperTabAttrName: 'UserRoles',
        mainProperty: 'idSysUserRole',
        orderProperty: 'idSysUserRole',
        orderType: 'ASC',
        refType: 'Array',
        tabCode: 'userRoles',
        firstUpperTabCode: 'UserRoles',
        tabName: '用户',
        billFormFields: [
          {
            idBillFormField: 'zTHhPm7n_Fhn8OJFED6-H',
            name: 'idSysUserRole',
            displayName: '用户角色关系主属性',
            fgMainProperty: true,
            showOrder: 0,
            readonly: true,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
          {
            idBillFormField: 'WZBcDmVwsrLncY974wVS_',
            name: 'idUser',
            dataType: 'InternalRef',
            displayName: '系统用户',
            fgMainProperty: false,
            showOrder: 2,
            refAttributeName: 'user',
            readonly: false,
            inputType: 'Ref',
            refConfig: {
              idBillRef: 'Sub29eMIj53l3wFfuYIl9',
              refStyle: 'table',
              backWriteProp: 'idUser',
              displayProp: 'account',
              title: '系统用户',
              tableRef: {
                dataUri: '/user/aqPage',
                fgPage: true,
                tableMainProp: 'idUser',
                refColumns: [
                  {
                    idBillRefColumn: 'RqR8GvrEMJZxAyBBp7DLU',
                    name: 'phone',
                    displayName: '手机号码',
                  },
                  {
                    idBillRefColumn: 'UOdlpcQLpndTIbCTfhFCu',
                    name: 'name',
                    displayName: '姓名 ',
                  },
                ],
                ceDisplayName: '系统用户',
              },
            },
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
        ],
        idBillFormTab: '69_dd_t1bBpks0yOd0QGg',
        tabIndex: 0,
        metadataAttrName: 'userRoles',
        fgDefaultTab: true,
        orderInfoList: [
          {
            idOrderInfo: '3La1NV95mK7BdvBs52MOB',
            orderProperty: 'idSysUserRole',
            orderType: 'ASC',
          },
        ],
      },
      {
        idAttribute: 'oGOEobgJJjQbkfdfOBmDt',
        tabClassName: 'RoleMenu',
        firstLowerTabClassName: 'roleMenu',
        tabAttrName: 'roleMenus',
        firstUpperTabAttrName: 'RoleMenus',
        mainProperty: 'idRoleMenu',
        orderProperty: 'idRoleMenu',
        orderType: 'ASC',
        refType: 'Array',
        tabCode: 'roleMenus',
        firstUpperTabCode: 'RoleMenus',
        tabName: '菜单',
        billFormFields: [
          {
            idBillFormField: 'mINBfowVO_ue_9WkrDeB7',
            name: 'idRoleMenu',
            displayName: '角色与菜单id',
            fgMainProperty: true,
            showOrder: 0,
            readonly: true,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
          {
            idBillFormField: 'APno3M2iPDzy-nSsPRy1i',
            name: 'idMenu',
            dataType: 'InternalRef',
            displayName: '系统菜单',
            fgMainProperty: false,
            showOrder: 2,
            refAttributeName: 'menu',
            readonly: false,
            inputType: 'Ref',
            refConfig: {
              idBillRef: 'giTic0fpaPzqlE2CrpFs7',
              refStyle: 'table',
              backWriteProp: 'idMenu',
              displayProp: 'name',
              title: '系统菜单',
              tableRef: {
                dataUri: '/menu/aqPage',
                fgPage: true,
                tableMainProp: 'idMenu',
                refColumns: [
                  {
                    idBillRefColumn: 'iIztDbY92W0bAhix2s0BD',
                    name: 'fgActive',
                    displayName: '启用标志',
                  },
                  {
                    idBillRefColumn: 'bs1LcQVNZaNh8a5gFp7wx',
                    name: 'menuType',
                    displayName: '菜单类型',
                  },
                ],
                ceDisplayName: '系统菜单',
              },
            },
            fgDisplay: true,
            width: 150,
            textLen: 140,
          },
        ],
        idBillFormTab: 'Scn0M2fDQbHCzg4NTKaZr',
        tabIndex: 1,
        orderInfoList: [
          {
            idOrderInfo: 'RJscwBsLJxeIN330Lgg90',
            orderProperty: 'idRoleMenu',
            orderType: 'ASC',
          },
        ],
      },
    ],
    tail: [],
    uriConf: {
      fetchById: '/roleAgg/getById',
      save: '/roleAgg/save',
      update: '/roleAgg/save',
      dataRemove: '/roleAgg/remove',
    },
  },
};

export { billformConf };
