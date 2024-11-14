import { moduleReducerName } from '../conf';
import { EPartName, TModuleStore } from '../model';

export const selectStatus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].status;
};

export const selectMetaData = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.metaData
    ? [state[moduleReducerName].data.metaData]
    : [];
};

export const selectModuleData = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data;
};

export const selectIdProject = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.idProject;
};

export const selectTip = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].tip;
};

export const selectFgFrom = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].fgForm;
};

export const selectTreeRef = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.treeRef;
};

export const selectSearchRefs = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.searchRefs;
};

export const selectBillFormTDTOsByPartName = (
  state: { [x: string]: TModuleStore },
  action: { payload: EPartName },
) => {
  if (state[moduleReducerName].data.configForm) {
    return state[moduleReducerName].data.configForm[action.payload];
  }
};

export const selectCurrent = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].current;
};

export const selectTableBillFormTDTOsByPartName = (
  state: { [x: string]: TModuleStore },
  action: { payload: EPartName },
) => {
  if (state[moduleReducerName].data.configList) {
    return state[moduleReducerName].data.configList[action.payload];
  }
};

export const selectTableCurrent = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].current;
};

/**选择信息是否改变过 */
export const selectFgChange = (state: { [x: string]: TModuleStore }) => {
  const metaData = state[moduleReducerName].data.metaData;
  if (metaData) {
    return true;
  }
  return false;
};
