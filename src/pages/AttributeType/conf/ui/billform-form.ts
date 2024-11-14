import { TBillFormContent } from '@/models';

const billformConf: TBillFormContent | undefined = {
  action: 1,
  billFormType: 'Single',
  componentModuleName: '公共属性',
  componentName: '数据类型',
  displayName: '数据类型',
  idBillForm: '7Qr7imQHM2bULYzpDez6L',
  idComponent: '0000-115f0f9f-1acf-4113-9d63-534cedc06fe8',
  idComponentModule: '0000-ae91cf86-2dba-4906-8fbc-b5e35d71909a',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'AttributeType',
  projectName: '模板代码设计工具RUST',
  subProjectName: '模型管理',
  configList: {
    idBillForm: 'uuDgPKneXJ0-JUIlNLylO',
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: 'fVzvpGVenymcuxlZeRKDZ',
        tabCode: 'dataType',
        tabName: '数据类型',
        tabIndex: 0,
        billFormFields: [
          {
            idBillFormField: 'Nzz-xzAHigjLR2XOWhqps',
            name: 'idDataType',
            displayName: '数据类型id',
            fgMainProperty: true,
            showOrder: 0,
            readonly: false,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: false,
          },
          {
            idBillFormField: 'ziqFPRGMuN7xxs2AmirXh',
            name: 'code',
            displayName: '数据类型编码',
            fgMainProperty: false,
            showOrder: 1,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'IojEZG4S9bAjCIuAoe0PU',
            name: 'displayName',
            displayName: '显示名称',
            fgMainProperty: false,
            showOrder: 2,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'Yg5Vu-2PBKbRFUAIR4sEB',
            name: 'note',
            displayName: '备注',
            fgMainProperty: false,
            showOrder: 3,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '-jRvTnZ8QvGGYG-7GwqL1',
            name: 'sn',
            displayName: '序列号',
            fgMainProperty: false,
            showOrder: 4,
            readonly: false,
            dataType: 'Integer',
            inputType: 'InputNumber',
            fgDisplay: true,
          },
          {
            idBillFormField: 'ngND6T5Ei8uV8Peb5PcP4',
            name: 'len',
            displayName: '长度',
            fgMainProperty: false,
            showOrder: 5,
            readonly: false,
            dataType: 'Integer',
            inputType: 'InputNumber',
            fgDisplay: true,
          },
          {
            idBillFormField: 'arThW5B9SrDJ8DIg4PslX',
            name: 'pcs',
            displayName: '精度',
            fgMainProperty: false,
            showOrder: 6,
            readonly: false,
            dataType: 'Integer',
            inputType: 'InputNumber',
            fgDisplay: true,
          },
          {
            idBillFormField: 'Xk4oLQekxEdYo2RjqPuqG',
            name: 'columnType',
            displayName: '字段类型',
            fgMainProperty: false,
            showOrder: 7,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'mUR_pHNOlosy-JByqAVrU',
            name: 'objectType',
            displayName: '对象类型名称',
            fgMainProperty: false,
            showOrder: 8,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'bMsn1vZgw7LHVDugZygEL',
            name: 'objectTypePackage',
            displayName: '对象类型包名',
            fgMainProperty: false,
            showOrder: 9,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'qJ89oPPXA8tHdP-V5JUz0',
            name: 'idProject',
            dataType: 'InternalRef',
            displayName: '项目',
            fgMainProperty: false,
            showOrder: 10,
            refAttributeName: 'project',
            readonly: false,
            inputType: 'Ref',
            refConfig: {
              refStyle: 'table',
              title: '项目',
              displayProp: 'displayName',
              backWriteProp: 'idProject',
              tableRef: {
                dataUri: '/project/aqDetail',
                tableMainProp: 'idProject',
                idComponentEntity: '0000-c42a3d77-90bd-4e33-8618-dc6b746109f7',
                ceDisplayName: '项目',
                refColumns: [
                  {
                    idBillRefColumn: '4NCYIJKn9cTZhxWvqMFEN',
                    name: 'code',
                    displayName: '项目编号',
                  },
                  {
                    idBillRefColumn: 'SFb6YBzXE5klsMkHKQRDz',
                    name: 'displayName',
                    displayName: '显示名称',
                  },
                ],
                searchRefs: [
                  {
                    idBillSearchRef: 's0tjXzSyi6RTsHgEpsdJh',
                    operatorCode: 'like',
                    attributeName: 'code',
                    label: '项目编号',
                    searchAttributes: ['code'],
                    htmlInputType: 'Input',
                    showOrder: 0,
                  },
                  {
                    idBillSearchRef: 'yBrXjJhsTJ3rygnfPM9VZ',
                    operatorCode: 'like',
                    attributeName: 'displayName',
                    label: '显示名称',
                    searchAttributes: ['displayName'],
                    htmlInputType: 'Input',
                    showOrder: 0,
                  },
                ],
              },
            },
            fgDisplay: true,
            fgTreeAttr: true,
          },
          {
            idBillFormField: 'Qg7UqXGsFBOePyPZ6ARZH',
            name: 'ext1',
            displayName: '扩展属性1',
            fgMainProperty: false,
            showOrder: 11,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '1-hH7Nsuf0dPlNJuu3A2m',
            name: 'ext2',
            displayName: '扩展属性2',
            fgMainProperty: false,
            showOrder: 12,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'FoHw4SEOcx0SJ8_MTYuA6',
            name: 'ext3',
            displayName: '扩展属性3',
            fgMainProperty: false,
            showOrder: 13,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'lnu-6hY_w95lZ7ZdZvNZ_',
            name: 'ext4',
            displayName: '扩展属性4',
            fgMainProperty: false,
            showOrder: 14,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '7dd7Xoouxtms7aLMq3Pg6',
            name: 'ext5',
            displayName: '扩展属性5',
            fgMainProperty: false,
            showOrder: 15,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'CgRYSajFaLFJp1zJBlopj',
            name: 'ext6',
            displayName: '扩展属性6',
            fgMainProperty: false,
            showOrder: 16,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'dCKxwcgxXscQMLEep7Djl',
            name: 'defaultValue',
            displayName: '默认值',
            fgMainProperty: false,
            showOrder: 17,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'S93u-QEXkqxlScGYQ9puP',
            name: 'fgMandatory',
            displayName: '必填标志',
            fgMainProperty: false,
            showOrder: 18,
            readonly: false,
            dataType: 'Boolean',
            inputType: 'Checkbox',
            fgDisplay: true,
          },
          {
            idBillFormField: 'inRYdgTYnfnslr-K5mjlr',
            name: 'typeScriptType',
            displayName: 'TypeScript类型',
            fgMainProperty: false,
            showOrder: 19,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'X-M6rQEh-7pj3Q7LDYyGv',
            name: 'webInputType',
            displayName: 'HTML5输入框类型',
            fgMainProperty: false,
            showOrder: 20,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'RfkYkeLAa_-8pZVVsaS69',
            name: 'fgPreset',
            displayName: '系统预置数据标识',
            fgMainProperty: false,
            showOrder: 21,
            readonly: false,
            dataType: 'Boolean',
            inputType: 'Checkbox',
            fgDisplay: true,
          },
        ],
        metadataAttrName: 'dataType',
        firstUpperTabCode: 'DataType',
        fgDefaultTab: true,
        tabClassName: 'DataType',
        firstLowerTabClassName: 'dataType',
        tabAttrName: 'dataType',
        firstUpperTabAttrName: 'DataType',
        mainProperty: 'idDataType',
        refType: 'Single',
        orderProperty: 'sn',
        orderType: 'ASC',
      },
    ],
    body: [],
    tail: [],
    uriConf: {
      page: '/dataType/aqPage',
      fetchById: '/dataType/getById',
      batchRemove: '/dataType/batchRemove',
    },
  },
  configForm: {
    idBillForm: 'uuDgPKneXJ0-JUIlNLylO',
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: 'fVzvpGVenymcuxlZeRKDZ',
        tabCode: 'dataType',
        tabName: '数据类型',
        tabIndex: 0,
        billFormFields: [
          {
            idBillFormField: 'Nzz-xzAHigjLR2XOWhqps',
            name: 'idDataType',
            displayName: '数据类型id',
            fgMainProperty: true,
            showOrder: 0,
            readonly: false,
            dataType: 'PK',
            inputType: 'Input',
            fgDisplay: false,
          },
          {
            idBillFormField: 'ziqFPRGMuN7xxs2AmirXh',
            name: 'code',
            displayName: '数据类型编码',
            fgMainProperty: false,
            showOrder: 1,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'IojEZG4S9bAjCIuAoe0PU',
            name: 'displayName',
            displayName: '显示名称',
            fgMainProperty: false,
            showOrder: 2,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'Yg5Vu-2PBKbRFUAIR4sEB',
            name: 'note',
            displayName: '备注',
            fgMainProperty: false,
            showOrder: 3,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '-jRvTnZ8QvGGYG-7GwqL1',
            name: 'sn',
            displayName: '序列号',
            fgMainProperty: false,
            showOrder: 4,
            readonly: false,
            dataType: 'Integer',
            inputType: 'InputNumber',
            fgDisplay: true,
          },
          {
            idBillFormField: 'ngND6T5Ei8uV8Peb5PcP4',
            name: 'len',
            displayName: '长度',
            fgMainProperty: false,
            showOrder: 5,
            readonly: false,
            dataType: 'Integer',
            inputType: 'InputNumber',
            fgDisplay: true,
          },
          {
            idBillFormField: 'arThW5B9SrDJ8DIg4PslX',
            name: 'pcs',
            displayName: '精度',
            fgMainProperty: false,
            showOrder: 6,
            readonly: false,
            dataType: 'Integer',
            inputType: 'InputNumber',
            fgDisplay: true,
          },
          {
            idBillFormField: 'Xk4oLQekxEdYo2RjqPuqG',
            name: 'columnType',
            displayName: '字段类型',
            fgMainProperty: false,
            showOrder: 7,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'mUR_pHNOlosy-JByqAVrU',
            name: 'objectType',
            displayName: '对象类型名称',
            fgMainProperty: false,
            showOrder: 8,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'bMsn1vZgw7LHVDugZygEL',
            name: 'objectTypePackage',
            displayName: '对象类型包名',
            fgMainProperty: false,
            showOrder: 9,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'qJ89oPPXA8tHdP-V5JUz0',
            name: 'idProject',
            dataType: 'InternalRef',
            displayName: '项目',
            fgMainProperty: false,
            showOrder: 10,
            refAttributeName: 'project',
            readonly: false,
            inputType: 'Ref',
            refConfig: {
              refStyle: 'table',
              title: '项目',
              displayProp: 'displayName',
              backWriteProp: 'idProject',
              tableRef: {
                dataUri: '/project/aqPage',
                tableMainProp: 'idProject',
                idComponentEntity: '0000-c42a3d77-90bd-4e33-8618-dc6b746109f7',
                ceDisplayName: '项目',
                refColumns: [
                  {
                    idBillRefColumn: '4NCYIJKn9cTZhxWvqMFEN',
                    name: 'code',
                    displayName: '项目编号',
                  },
                  {
                    idBillRefColumn: 'SFb6YBzXE5klsMkHKQRDz',
                    name: 'displayName',
                    displayName: '显示名称',
                  },
                ],
              },
            },
            fgDisplay: true,
            fgTreeAttr: true,
          },
          {
            idBillFormField: 'Qg7UqXGsFBOePyPZ6ARZH',
            name: 'ext1',
            displayName: '扩展属性1',
            fgMainProperty: false,
            showOrder: 11,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '1-hH7Nsuf0dPlNJuu3A2m',
            name: 'ext2',
            displayName: '扩展属性2',
            fgMainProperty: false,
            showOrder: 12,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'FoHw4SEOcx0SJ8_MTYuA6',
            name: 'ext3',
            displayName: '扩展属性3',
            fgMainProperty: false,
            showOrder: 13,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'lnu-6hY_w95lZ7ZdZvNZ_',
            name: 'ext4',
            displayName: '扩展属性4',
            fgMainProperty: false,
            showOrder: 14,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: '7dd7Xoouxtms7aLMq3Pg6',
            name: 'ext5',
            displayName: '扩展属性5',
            fgMainProperty: false,
            showOrder: 15,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'CgRYSajFaLFJp1zJBlopj',
            name: 'ext6',
            displayName: '扩展属性6',
            fgMainProperty: false,
            showOrder: 16,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'dCKxwcgxXscQMLEep7Djl',
            name: 'defaultValue',
            displayName: '默认值',
            fgMainProperty: false,
            showOrder: 17,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'S93u-QEXkqxlScGYQ9puP',
            name: 'fgMandatory',
            displayName: '必填标志',
            fgMainProperty: false,
            showOrder: 18,
            readonly: false,
            dataType: 'Boolean',
            inputType: 'Checkbox',
            fgDisplay: true,
          },
          {
            idBillFormField: 'inRYdgTYnfnslr-K5mjlr',
            name: 'typeScriptType',
            displayName: 'TypeScript类型',
            fgMainProperty: false,
            showOrder: 19,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'X-M6rQEh-7pj3Q7LDYyGv',
            name: 'webInputType',
            displayName: 'HTML5输入框类型',
            fgMainProperty: false,
            showOrder: 20,
            readonly: false,
            dataType: 'String',
            inputType: 'Input',
            fgDisplay: true,
          },
          {
            idBillFormField: 'RfkYkeLAa_-8pZVVsaS69',
            name: 'fgPreset',
            displayName: '系统预置数据标识',
            fgMainProperty: false,
            showOrder: 21,
            readonly: false,
            dataType: 'Boolean',
            inputType: 'Checkbox',
            fgDisplay: true,
          },
        ],
        metadataAttrName: 'dataType',
        firstUpperTabCode: 'DataType',
        fgDefaultTab: true,
        tabClassName: 'DataType',
        firstLowerTabClassName: 'dataType',
        tabAttrName: 'dataType',
        firstUpperTabAttrName: 'DataType',
        mainProperty: 'idDataType',
        refType: 'Single',
        orderProperty: 'sn',
        orderType: 'ASC',
      },
    ],
    body: [],
    tail: [],
    uriConf: {
      fetchById: '/dataType/getById',
      save: '/dataType/add',
      update: '/dataType/update',
      dataRemove: '/dataType/remove',
    },
  },
};

export { billformConf };
