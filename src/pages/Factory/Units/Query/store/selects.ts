import { moduleReducerName } from '../conf';
import { TModuleStore } from '../model';

export const selectStatus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].status;
};

export const selectModuleData = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data;
};

export const selectMetaData = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.metaData;
};

export const selectSearchRefs = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.searchRefs;
};

export const selectCurrentSearchRef = (state: {
  [x: string]: TModuleStore;
}) => {
  if (state[moduleReducerName].current?.type === 'field') {
    return state[moduleReducerName].data.searchRefs?.find(
      (s) => s.idBillSearchRef === state[moduleReducerName].current?.id,
    );
  }
};
