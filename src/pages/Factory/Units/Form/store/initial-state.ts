import { nanoid } from '@reduxjs/toolkit';
import {
  TBillFormConfigForm,
  TModuleStore,
  TTableBillFormConfigList,
} from '../model';

export const getInitConfigForm = () => {
  const i: TBillFormConfigForm = {
    idBillForm: nanoid(),
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: nanoid(),
        tabCode: 'defaulttab',
        tabName: '默认页签',
        tabIndex: 0,
        billFormFields: [],
      },
    ],
    body: [],
    tail: [],
  };
  return i;
};

export const getInitConfigList = () => {
  const i: TTableBillFormConfigList = {
    idBillForm: nanoid(),
    name: 'newBill',
    displayName: '新表单',
    header: [
      {
        idBillFormTab: nanoid(),
        tabCode: 'defaulttab',
        tabName: '默认页签',
        tabIndex: 0,
        billFormFields: [],
      },
    ],
    body: [],
    tail: [],
  };
  return i;
};

export const getInitialState = () => {
  const initialState: TModuleStore = {
    status: 'idle',
    fgForm: true,
    data: {
      metaData: undefined,
      billFormType: 'Single',
      configForm: getInitConfigForm(),
      configList: getInitConfigList(),
    },
  };
  return initialState;
};

export const initialState: TModuleStore = getInitialState();
