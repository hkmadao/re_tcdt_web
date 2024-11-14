import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { EActiveKey, TModuleStore, TTreeContent } from '../model';
import { TBillTreeRef } from '@/pages/Factory/Units/common/model';

export const setActiveKey: CaseReducer<
  TModuleStore,
  PayloadAction<EActiveKey>
> = (state, action) => {
  state.activeKey = action.payload;
};

export const updateBase: CaseReducer<
  TModuleStore,
  PayloadAction<TTreeContent>
> = (state, action) => {
  const treeContent: TTreeContent = action.payload;
  state.data = {
    ...treeContent,
    firstTreeRef: state.data.firstTreeRef,
    thirdTreeRef: state.data.thirdTreeRef,
    searchAttrs: state.data.searchAttrs,
    twoLevelStatus: state.data.twoLevelStatus,
  };
};

export const updateNodeTreeRef: CaseReducer<
  TModuleStore,
  PayloadAction<TBillTreeRef>
> = (state, action) => {
  const treeRef: TBillTreeRef = action.payload;
  if (state.activeKey === EActiveKey.firstTreeRef) {
    state.data.firstTreeRef = {
      ...state.data.firstTreeRef,
      ...treeRef,
    };
  }
  if (state.activeKey === EActiveKey.thirdTreeRef) {
    state.data.thirdTreeRef = {
      ...state.data.firstTreeRef,
      ...treeRef,
    };
  }
};

export const updateTreeContent: CaseReducer<
  TModuleStore,
  PayloadAction<TTreeContent>
> = (state, action) => {
  const treeContent: TTreeContent = action.payload;
  state.data = { ...treeContent };
};

export const toggleTwoLevelStatus: CaseReducer<
  TModuleStore,
  PayloadAction<boolean>
> = (state, action) => {
  const twoLevelStatus = action.payload;
  state.data.twoLevelStatus = twoLevelStatus;
  if (!twoLevelStatus) {
    state.activeKey = EActiveKey.firstTreeRef;
  }
};
