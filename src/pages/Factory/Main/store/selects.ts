import { moduleReducerName } from '../conf';
import { TModuleStore, TLayout } from '../model';
import { findLayout } from './util';

export const selectStatus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].status;
};

export const selectModuleData = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data;
};

export const selectPages = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.pages;
};

export const selectLayouts = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.layouts;
};

export const selectAssos = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.assos;
};

export const selectCurrentPage = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.pages.find(
    (p) => p.id === state[moduleReducerName].currentPageId,
  );
};

export const selectCurrentLayout = (state: { [x: string]: TModuleStore }) => {
  return findLayout(
    state[moduleReducerName].currentLayoutId!,
    state[moduleReducerName].data.layouts,
  );
};

export const selectCurrentAsso = (state: { [x: string]: TModuleStore }) => {
  return state[moduleReducerName].data.assos.find(
    (asso) =>
      asso.idPage === state[moduleReducerName].currentPageId &&
      asso.idLayout === state[moduleReducerName].currentLayoutId,
  );
};
