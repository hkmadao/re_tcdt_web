import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TModuleStore, TTree } from '../models';
import { Key } from 'react';

export const setSelectedNode: CaseReducer<
  TModuleStore,
  PayloadAction<{ keys: Key[]; node: TTree }>
> = (state, action) => {
  const { keys, node } = action.payload;
  state.selectedNode = node;
  state.selectedKeys = keys;
};

export const cancelSelectedNode: CaseReducer<
  TModuleStore,
  PayloadAction<void>
> = (state, action) => {
  state.selectedKeys = [];
  state.selectedNode = undefined;
};

export const toggleExpand: CaseReducer<TModuleStore, PayloadAction<Key>> = (
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
  TModuleStore,
  PayloadAction<Key[]>
> = (state, action) => {
  state.expandedKeys = action.payload;
};
