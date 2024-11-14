import { nanoid } from '@reduxjs/toolkit';
import { TModuleStore } from '../model';

export const getInitialState = () => {
  const initialState: TModuleStore = {
    status: 'idle',
    pageInfo: {
      pageInfoInput: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
      },
      dataList: [],
    },
    refProps: undefined,
    searchValues: undefined,
  };
  return initialState;
};

export const initialState: TModuleStore = getInitialState();
