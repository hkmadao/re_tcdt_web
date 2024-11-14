import { moduleReducerName } from '../conf';
import { EActiveKey, TModuleStore } from '../model';

export const selectStatus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].status;
};

export const selectModuleData = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data;
};

export const selectActiveKey = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].activeKey;
};

export const selectTwoLevelStatus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.twoLevelStatus;
};

export const selectTreeContent = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data;
};

export const selectCurrentNodeTreeRef = (state: {
  [x: string]: TModuleStore;
}) => {
  if (state[moduleReducerName].activeKey === EActiveKey.firstTreeRef) {
    return state[moduleReducerName].data.firstTreeRef;
  }
  if (state[moduleReducerName].activeKey === EActiveKey.thirdTreeRef) {
    return state[moduleReducerName].data.thirdTreeRef;
  }
};

export const selectFirstTreeRef = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.firstTreeRef;
};

export const selectThirdTreeRef = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.thirdTreeRef;
};
