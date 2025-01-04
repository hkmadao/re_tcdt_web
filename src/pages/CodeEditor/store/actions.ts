import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TDomainStore } from './models';
import { TTree } from '@/models';
import { Key } from 'react';
import { deepCopy, getMatchKeys, getTreeByKeys, getTreeKeys } from '@/util';
import { TProject } from '../models';

export const setSelectedNode: CaseReducer<
  TDomainStore,
  PayloadAction<{ keys: Key[]; node: TTree }>
> = (state, action) => {
  const { keys, node } = action.payload;
  state.selectedNode = node;
  state.selectedKeys = keys;
};

export const cancelSelectedNode: CaseReducer<
  TDomainStore,
  PayloadAction<void>
> = (state, action) => {
  state.selectedKeys = [];
  state.selectedNode = undefined;
};

export const toggleExpand: CaseReducer<TDomainStore, PayloadAction<Key>> = (
  state,
  action,
) => {
  if (state.expandedKeys.includes(action.payload)) {
    state.expandedKeys = state.expandedKeys.filter((k) => k !== action.payload);
    return;
  }
  state.expandedKeys = state.expandedKeys.concat([action.payload]);
};

export const setExpandedKeys: CaseReducer<
  TDomainStore,
  PayloadAction<Key[]>
> = (state, action) => {
  state.expandedKeys = action.payload;
};

export const searchTreeNode: CaseReducer<
  TDomainStore,
  PayloadAction<string | undefined>
> = (state, action) => {
  const searchValue = action.payload;
  if (!searchValue) {
    state.foundKeys = [];
    state.treeData = state.sourchTreeData || [];
    return;
  }
  const foundKeys = getMatchKeys(
    ['filePathName'],
    searchValue,
    state.sourchTreeData || [],
  );
  const foundTree = getTreeByKeys(foundKeys, state.sourchTreeData || []);
  state.expandedKeys = getTreeKeys(foundTree);
  state.foundKeys = foundKeys;
  state.treeData = foundTree;
};

export const toggleFgEdit: CaseReducer<TDomainStore, PayloadAction<boolean>> = (
  state,
  action,
) => {
  state.fgEdit = action.payload;
};

export const setCurrentProject: CaseReducer<
  TDomainStore,
  PayloadAction<TProject | undefined>
> = (state, action) => {
  state.currentProject = action.payload;
};
