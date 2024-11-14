import { moduleReducerName } from '../conf';
import { TModuleStore } from '../model';

export const selectStatus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].status;
};
