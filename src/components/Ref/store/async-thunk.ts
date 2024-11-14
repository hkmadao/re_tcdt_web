import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { moduleReducerName } from '../conf';
import { TModuleStore, TRefProps } from '../model';
import {
  andLogicNode,
  buildFilterValueBySearchRef,
  equalFilterNode,
  orLogicNode,
  stringFilterParam,
  TBillTreeRef,
  TCondition,
  TFilterNode,
  TPageInfoInput,
  TTree,
} from '@/models';
import BaseAPI from '@/api';

const treeDataSet = (billTreeRef: TBillTreeRef, treeDatas: (TTree | any)[]) => {
  if (!treeDatas || treeDatas.length === 0) {
    return;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    treeDatas[i].key = treeDatas[i][billTreeRef.keyAttr!];
    treeDatas[i].id = treeDatas[i][billTreeRef.keyAttr!];
    treeDatas[i].title = treeDatas[i][billTreeRef.labelAttr!];
    treeDataSet(billTreeRef, treeDatas[i].children);
  }
};

const getTreeDatas = (
  uri: string,
  methodType: 'POST' | 'GET',
  params?: TCondition,
) => {
  if (methodType === 'POST') {
    return BaseAPI.POST(uri, params);
  }
  return BaseAPI.GET(uri, params);
};

const getTableDatas = (
  uri: string,
  methodType: 'POST' | 'GET',
  params?: TCondition,
) => {
  if (methodType === 'POST') {
    return BaseAPI.POST(uri, params);
  }
  return BaseAPI.GET(uri, params);
};

export const fetchTableData = createAsyncThunk(
  `${moduleReducerName}/getTableData`,
  async (
    param: {
      refProps: TRefProps;
      searchValues?: any;
      idTreeNode?: string;
      pageIndex?: number;
      pageSize?: number;
    },
    thunkAPI,
  ) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleReducerName];
    const refProps = param.refProps;
    const idTreeNode = param.idTreeNode;
    const condition = param.searchValues;
    const searchRefs = refProps!.tableRef?.searchRefs;
    const treeRefMainKey = refProps!.tableRef?.treeRefMainKey;
    const gridFixedFilterNodes = refProps!.gridFixedFilterNodes;
    /**and条件 */
    let filterNodes: TFilterNode[] = [];
    /**or条件 */
    let orFilterNodes: TFilterNode[] = [];
    /**创建搜索条件 */
    if (searchRefs && condition) {
      Object.keys(condition).forEach((cKey) => {
        const findSearchRef = searchRefs.find(
          (searchRef) => searchRef.attributeName === cKey,
        );
        if (findSearchRef) {
          if (
            !(
              findSearchRef.operatorCode === 'isNull' ||
              findSearchRef.operatorCode === 'notNull'
            ) &&
            (condition[cKey] === undefined || condition[cKey] === null)
          ) {
            return;
          }
          const searchAttributes = findSearchRef.searchAttributes;
          if (searchAttributes?.length === 1) {
            filterNodes = searchAttributes.map((sa) => {
              return {
                name: sa,
                operatorCode: findSearchRef.operatorCode,
                filterParams: buildFilterValueBySearchRef(
                  findSearchRef,
                  condition[cKey],
                ),
              };
            });
          } else {
            //多个条件，需要创建or条件
            orFilterNodes =
              searchAttributes?.map((sa) => {
                return {
                  name: sa,
                  operatorCode: findSearchRef.operatorCode,
                  filterParams: buildFilterValueBySearchRef(
                    findSearchRef,
                    condition[cKey],
                  ),
                };
              }) || [];
          }
        }
      });
    }
    if (refProps!.refStyle === 'treeTable') {
      const treeNode = state.selectedNodes?.find((n) => true);
      if (treeRefMainKey) {
        filterNodes.push(
          equalFilterNode(
            treeRefMainKey,
            stringFilterParam(treeNode[treeRefMainKey]),
          ),
        );
      }
    }
    if (gridFixedFilterNodes) {
      filterNodes = filterNodes.concat(gridFixedFilterNodes);
    }
    const searchParam: TPageInfoInput = {
      pageIndex: param.pageIndex || 1,
      pageSize: param.pageSize || 10,
      logicNode: andLogicNode(filterNodes)(
        orFilterNodes.length > 0 ? orLogicNode(orFilterNodes)() : undefined,
      ),
    };

    const pageInfo = await getTableDatas(
      refProps!.tableRef?.dataUri!,
      'POST',
      searchParam,
    );

    return {
      pageInfo,
      searchValues: param.searchValues,
    };
  },
);

export const fetchTreeData = createAsyncThunk(
  `${moduleReducerName}/fetchTreeData`,
  async (param: { refProps: TRefProps }, thunkAPI) => {
    const state: TModuleStore = (thunkAPI.getState() as any)[moduleReducerName];
    const uri = param.refProps?.billTreeRef?.uri;
    const method = param.refProps?.billTreeRef?.method;
    const treeDatas: (TTree | any)[] = await getTreeDatas(
      uri!,
      method || 'GET',
      {},
    );
    treeDataSet(param.refProps!.billTreeRef!, treeDatas);
    return treeDatas;
  },
);
