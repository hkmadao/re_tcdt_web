import { createAsyncThunk } from '@reduxjs/toolkit';
import { TMessage } from '@/util';
import { componentName } from '../conf';
import {
  andLogicNode,
  buildFilterValueBySearchRef,
  equalFilterNode,
  EDirection,
  TFilterNode,
  TPageInfo,
  TPageInfoInput,
  TTree,
  stringFilterParam,
} from '@/models';
import { TTableStore } from '../models';
import { queryConf, tableConf } from '../../../../conf';
import ListAPI from '../api';
import { TRole } from '../../../../models';
const searcheRefs = queryConf?.searchRefs;

export const fetchByTreeNode = createAsyncThunk(
  `${tableConf?.name}/fetchByTreeNode`,
  async (message: TMessage, thunkAPI) => {
    if (!message) {
      return;
    }
    const selectedTreeNode: TTree = message.data as TTree;
    const fns: TFilterNode[] = [];
    const params: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'idRole',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TRole> = await ListAPI.pageList(params);
    return {
      selectedTreeNode,
      pageInfo,
    };
  },
);

export const search = createAsyncThunk(
  `${tableConf?.name}/search`,
  async (message: TMessage, thunkAPI) => {
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    if (!message || message.consumerIds.includes(componentName)) {
      return;
    }
    const searchData = message.data;
    const fns: TFilterNode[] = [];
    if (searchData) {
      searcheRefs?.forEach((searcheRef) => {
        if (
          !(
            searcheRef.operatorCode === 'isNull' ||
            searcheRef.operatorCode === 'notNull'
          ) &&
          (searchData[searcheRef.attributeName!] === undefined ||
            searchData[searcheRef.attributeName!] === null)
        ) {
          return;
        }
        if (searcheRef.operatorCode) {
          const fn: TFilterNode = {
            name: searcheRef.attributeName!,
            operatorCode: searcheRef.operatorCode,
            filterParams: buildFilterValueBySearchRef(
              searcheRef,
              searchData[searcheRef.attributeName!],
            ),
          };
          fns.push(fn);
        }
      });
    }
    const params: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'idRole',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TRole> = await ListAPI.pageList(params);
    return {
      searchData,
      pageInfo,
    };
  },
);

export const reflesh = createAsyncThunk(
  `${tableConf?.name}/reflesh`,
  async (params: void, thunkAPI) => {
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const searchData = state.searchData;
    const fns: TFilterNode[] = [];
    if (searcheRefs && searchData) {
      searcheRefs.forEach((searcheRef) => {
        if (
          !(
            searcheRef.operatorCode === 'isNull' ||
            searcheRef.operatorCode === 'notNull'
          ) &&
          (searchData[searcheRef.attributeName!] === undefined ||
            searchData[searcheRef.attributeName!] === null)
        ) {
          return;
        }
        if (searcheRef.operatorCode) {
          const fn: TFilterNode = {
            name: searcheRef.attributeName!,
            operatorCode: searcheRef.operatorCode,
            filterParams: buildFilterValueBySearchRef(
              searcheRef,
              searchData[searcheRef.attributeName!],
            ),
          };
          fns.push(fn);
        }
      });
    }
    const searchParam: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'idRole',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TRole> = await ListAPI.pageList(searchParam);
    return pageInfo;
  },
);

export const pageChange = createAsyncThunk(
  `${tableConf?.name}/pageChange`,
  async (params: { page: number; pageSize: number }, thunkAPI) => {
    const { page, pageSize } = params;
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const fns: TFilterNode[] = [];
    const searchData = state.searchData;
    if (searcheRefs && searchData) {
      searcheRefs.forEach((searcheRef) => {
        if (searchData[searcheRef.attributeName!]) {
          if (
            !(
              searcheRef.operatorCode === 'isNull' ||
              searcheRef.operatorCode === 'notNull'
            ) &&
            (searchData[searcheRef.attributeName!] === undefined ||
              searchData[searcheRef.attributeName!] === null)
          ) {
            return;
          }
          const fn: TFilterNode = {
            name: searcheRef.attributeName!,
            operatorCode: searcheRef.operatorCode,
            filterParams: [searchData[searcheRef.attributeName!]],
          };
          fns.push(fn);
        }
      });
    }
    const queyrParams: TPageInfoInput = {
      pageIndex: page,
      pageSize: pageSize,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'idRole',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TRole> = await ListAPI.pageList(queyrParams);
    return pageInfo;
  },
);

export const batchRemove = createAsyncThunk(
  `${tableConf?.name}/batchRemove`,
  async (message: TMessage, thunkAPI) => {
    if (!message || message.consumerIds.includes(componentName)) {
      return;
    }
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const deleteDatas = state.tableData?.filter((d) =>
      state.selectedRowKeys?.includes(d.idRole!),
    );
    if (!deleteDatas || deleteDatas.length === 0) {
      return;
    }
    await ListAPI.batchRemove(deleteDatas);
    const fns: TFilterNode[] = [];
    const params: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'idRole',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TRole> = await ListAPI.pageList(params);
    return pageInfo;
  },
);
