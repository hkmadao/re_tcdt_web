import { CaseReducer, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { GenerateType, TDomainStore, TSubPath } from '../models';

export const addSubItem: CaseReducer<
  TDomainStore,
  PayloadAction<{ attrName: GenerateType; data: TSubPath }>
> = (state, action) => {
  const { attrName, data } = action.payload;
  data.id = nanoid();
  const currentConf = state.data.confDataList.find(
    (conf) => conf.id === state.data.idCurrent,
  );
  if (currentConf && currentConf[attrName]) {
    currentConf[attrName] = [data, ...currentConf[attrName]];
    const index = state.data.confDataList.findIndex(
      (conf) => conf.id === currentConf.id,
    );
    state.data.confDataList = state.data.confDataList.splice(
      index,
      1,
      currentConf,
    );
  }
};

export const updateSubItem: CaseReducer<
  TDomainStore,
  PayloadAction<{ attrName: GenerateType; data: TSubPath }>
> = (state, action) => {
  const { attrName, data } = action.payload;
  const currentConf = state.data.confDataList.find(
    (conf) => conf.id === state.data.idCurrent,
  );
  if (currentConf && currentConf[attrName]) {
    currentConf[attrName] = currentConf[attrName].map((methodParam) => {
      if (methodParam.id === data.id) {
        methodParam = { ...methodParam, ...data };
      }
      return methodParam;
    });
    const index = state.data.confDataList.findIndex(
      (conf) => conf.id === currentConf.id,
    );
    state.data.confDataList = state.data.confDataList.splice(
      index,
      1,
      currentConf,
    );
  }
};

export const deleteSubItem: CaseReducer<
  TDomainStore,
  PayloadAction<{ attrName: GenerateType; data: TSubPath }>
> = (state, action) => {
  const { attrName, data } = action.payload;
  const currentConf = state.data.confDataList.find(
    (conf) => conf.id === state.data.idCurrent,
  );
  if (currentConf && currentConf[attrName]) {
    currentConf[attrName] = currentConf[attrName].filter((methodParam) => {
      if (methodParam.id === data.id) {
        return false;
      }
      return true;
    });
    const index = state.data.confDataList.findIndex(
      (conf) => conf.id === currentConf.id,
    );
    state.data.confDataList = state.data.confDataList.splice(
      index,
      1,
      currentConf,
    );
  }
};
