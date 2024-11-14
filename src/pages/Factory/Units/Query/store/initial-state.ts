import { TModuleStore } from '../model';

export const initialState: TModuleStore = {
  status: 'idle',
  data: {
    metaData: undefined,
    searchRefs: [
      // {
      //   idBillSearchRef: '2DRNJ9AeIdM07sHBhJWmA',
      //   operatorCode: 'like',
      //   attributeName: 'displayName',
      //   label: '方法显示名称',
      //   searchAttributes: ['displayName'],
      //   valueType: 'Input',
      //   showOrder: 0,
      // },
      // {
      //   idBillSearchRef: 'hty0lWQYd7raegD7cMrO_',
      //   operatorCode: 'equal',
      //   attributeName: 'idProject',
      //   label: '项目id',
      //   searchAttributes: ['idProject'],
      //   valueType: 'Ref',
      //   showOrder: 1,
      //   refConfig: {
      //     idBillRef: '',
      //     refStyle: 'table',
      //     title: '项目',
      //     dataUri: '/project/aqPage',
      //     displayProp: 'displayName',
      //     backWriteProp: 'idProject',
      //     label: '项目',
      //     propertyName: 'idProject',
      //     refPropertyName: 'project',
      //     refColumns: [
      //       {
      //         idBillRefColumn: 'awiGkb2InaN1WVlLoR44y',
      //         name: 'name',
      //         displayName: '项目名称',
      //       },
      //       {
      //         idBillRefColumn: 'mJNhbiFdcGAEv2hFoDzVb',
      //         name: 'displayName',
      //         displayName: '显示名称',
      //       },
      //     ],
      //   },
      // },
    ],
  },
  current: {
    type: 'field',
    id: '',
  },
};
