import { moduleReducerName } from '../conf';
import { TModuleStore } from '../model';
import { useSelector, useDispatch } from 'react-redux';

export const useStatus = () => {
  const select = (state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].status;
  };
  return useSelector(select);
};

export const usePageInfo = () => {
  const select = (state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].pageInfo;
  };
  return useSelector(select);
};

export const useTreeData = () => {
  const select = (state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].treeData;
  };
  return useSelector(select);
};

export const useSelectedRows = () => {
  const select = (state: { [x: string]: TModuleStore }) => {
    const { selectedRowKeys, selectedRows } = state[moduleReducerName];
    if (selectedRowKeys) {
      return { selectedRowKeys, selectedRows };
    }
    return { selectedRowKeys: [], selectedRows: [] };
  };
  return useSelector(select);
};

export const useSelectedNodes = () => {
  const select = (state: { [x: string]: TModuleStore }) => {
    const { selectedNodeKeys, selectedNodes } = state[moduleReducerName];
    if (selectedNodeKeys) {
      return { selectedNodeKeys, selectedNodes };
    }
    return { selectedNodeKeys: [], selectedNodes: [] };
  };
  return useSelector(select);
};
