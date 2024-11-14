import { CaseReducer, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TFormStore } from '../models';
import { TTree, DOStatus } from '@/models';
import { Key } from 'react';
import { TMenu } from '../../../../models';
import { subject } from '../../../../conf';
import { deepCopy } from '@/util';
export const setComponentInfo: CaseReducer<
  TFormStore,
  PayloadAction<{ idUiConf: string; fgDisabled: boolean }>
> = (state, action) => {
  const { idUiConf, fgDisabled } = action.payload;
  state.idUiConf = idUiConf;
  state.fgDisabled = fgDisabled;
};

export const setFormData: CaseReducer<TFormStore, PayloadAction<TMenu>> = (
  state,
  action,
) => {
  state.formData = { ...action.payload };
};

export const addFormData: CaseReducer<
  TFormStore,
  PayloadAction<{ nodeData: any }>
> = (state, action) => {
  const { nodeData } = action.payload;
  state.treeSelectedNode = nodeData;
  state.formData = {
    idMenu: nanoid(),
    action: DOStatus.NEW,
  };
  if (nodeData) {
    state.formData.idParent = nodeData.idParent;
    state.formData.parent = deepCopy(nodeData);
  }
  state.newDataArr = [];
  state.editData = undefined;
  state.editStatusInfo = {
    id: nanoid(),
    editStatus: 'toAdd',
  };
};

export const cancle: CaseReducer<TFormStore, PayloadAction<void>> = (
  state,
  action,
) => {
  if (state.editData) {
    subject.publish({
      topic: 'updateSuccess',
      producerId: state.idUiConf!,
      data: deepCopy(state.editData),
    });
  }
  if (state.newDataArr) {
    subject.publish({
      topic: 'addSuccess',
      producerId: state.idUiConf!,
      data: deepCopy(state.newDataArr),
    });
  }
  subject.publish({
    topic: '/page/change',
    producerId: state.idUiConf!,
    data: 'list',
  });
};

export const updateFormData: CaseReducer<TFormStore, PayloadAction<TMenu>> = (
  state,
  action,
) => {
  console.log(action.payload);
  state.formData = {
    ...state.formData,
    ...action.payload,
    action:
      state.formData.action !== DOStatus.NEW
        ? DOStatus.UPDATED
        : state.formData.action,
    idMenu: state.formData.idMenu,
  };
};
