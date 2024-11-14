import { TDomainStore, moduleReducerName } from '../models';

export const selectStatus = (state: { [x: string]: TDomainStore }) => {
  return state[moduleReducerName].status;
};

export const selectModuleData = (state: { [x: string]: TDomainStore }) => {
  return state[moduleReducerName].data;
};

export const selectConfList = (state: { [x: string]: TDomainStore }) => {
  return state[moduleReducerName].data.confDataList;
};

export const selectCurrentConf = (state: { [x: string]: TDomainStore }) => {
  return state[moduleReducerName].data.confDataList.find(
    (conf) => conf.id === state[moduleReducerName].data.idCurrent,
  );
};

export const selectActiveConf = (state: { [x: string]: TDomainStore }) => {
  return state[moduleReducerName].data.confDataList.find(
    (conf) => conf.fgActive,
  );
};
