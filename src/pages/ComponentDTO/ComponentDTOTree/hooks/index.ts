import { useSelector } from 'react-redux';
import { TModuleStore } from '../models';
import { moduleName } from '../conf';

export const useSelectedNode = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].selectedNode;
  });
};

export const useTreeData = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].treeData;
  });
};

export const useSelectedKeys = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].selectedKeys;
  });
};

export const useExpandedKeys = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].expandedKeys;
  });
};

export const useFoundKeys = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].foundKeys;
  });
};
