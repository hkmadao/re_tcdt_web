import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TModuleStore } from '../model';
import { Key } from 'react';
import { getInitialState } from './initial-state';

export const initPageInfo: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  state.treeData = [];
  state.selectedNodeKeys = [];
  state.selectedNodes = [];
  state.selectedRowKeys = [];
  state.selectedRows = [];
  state.pageInfo = {
    pageInfoInput: {
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
    },
    dataList: [],
  };
};

export const setSelectedNodes: CaseReducer<
  TModuleStore,
  PayloadAction<{ nodeKeys: Key[]; nodes: any[] }>
> = (state, action) => {
  const { nodeKeys, nodes } = action.payload;
  state.selectedNodeKeys = nodeKeys;
  state.selectedNodes = nodes;
  state.selectedRowKeys = [];
  state.selectedRows = [];
};

export const setSelectedRows: CaseReducer<
  TModuleStore,
  PayloadAction<{ rowKeys: Key[]; rows: any[] }>
> = (state, action) => {
  const { rowKeys, rows } = action.payload;
  state.selectedRowKeys = rowKeys;
  state.selectedRows = rows;
};
