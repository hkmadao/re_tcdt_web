import { useSelector } from 'react-redux';
import { TTableStore } from '../models';
import { componentName } from '../conf';

export * from './columns';
const selectStatus = (state: { [x: string]: TTableStore }) => {
  return state[componentName].status;
};

const selectStoreData = (state: { [x: string]: TTableStore }) => {
  return state[componentName];
};

const selectSelectRow = (state: { [x: string]: TTableStore }) => {
  if (
    !state[componentName].selectedRowKeys ||
    state[componentName].selectedRowKeys.length !== 1
  ) {
    return;
  }
  return state[componentName].tableData?.find((d) =>
    state[componentName].selectedRowKeys?.includes(d.idMenu!),
  );
};

const selectIdUiConf = (state: { [x: string]: TTableStore }) => {
  return state[componentName].idUiConf;
};

export const useIdUiConf = () => {
  return useSelector(selectIdUiConf);
};

export const useFgDisabled = () => {
  return useSelector((state: { [x: string]: TTableStore }) => {
    return state[componentName].fgDisabled;
  });
};

export const useStoreData = () => {
  return useSelector(selectStoreData);
};

export const useSelectRow = () => {
  return useSelector(selectSelectRow);
};
