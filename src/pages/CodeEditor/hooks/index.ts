import { useSelector } from 'react-redux';
import { TDomainStore } from '../store/models';
import { componentName } from '../conf';
import { getSelectedNodes } from '@/util';

const selectStatus = (state: { [x: string]: TDomainStore }) => {
  return state[componentName].status;
};

const selectFgEdit = (state: { [x: string]: TDomainStore }) => {
  return state[componentName].fgEdit;
};

const selectTreeData = (state: { [x: string]: TDomainStore }) => {
  return state[componentName].treeData;
};

const selectCurrentProject = (state: { [x: string]: TDomainStore }) => {
  return state[componentName].currentProject;
};

const selectSelectedNode = (state: { [x: string]: TDomainStore }) => {
  if (state[componentName].selectedKeys) {
    const selectNodes = getSelectedNodes(
      state[componentName].selectedKeys,
      state[componentName].treeData ?? [],
    );
    if (selectNodes && selectNodes.length === 1) {
      return selectNodes[0];
    }
  }
  return undefined;
};

export const useLoadingStatus = () => {
  return useSelector(selectStatus);
};

export const useSelectedNode = () => {
  return useSelector(selectSelectedNode);
};

export const useTreeData = () => {
  return useSelector(selectTreeData);
};

export const useSelectedKeys = () => {
  return useSelector((state: { [x: string]: TDomainStore }) => {
    return state[componentName].selectedKeys;
  });
};

export const useExpandedKeys = () => {
  return useSelector((state: { [x: string]: TDomainStore }) => {
    return state[componentName].expandedKeys;
  });
};

export const useFoundKeys = () => {
  return useSelector((state: { [x: string]: TDomainStore }) => {
    return state[componentName].foundKeys;
  });
};

export const useFgEdit = () => {
  return useSelector(selectFgEdit);
};

export const useCurrentProject = () => {
  return useSelector(selectCurrentProject);
};
