import { EValueType, TBillSearchRef } from '.';
import {
  EOperatorCode,
  ELogicOperatorCode,
  EDirection,
  DOStatus,
} from './enums';

export type TcdtType = {
  dataType: EValueType;
  value: any;
};

/** 公共返回数据 */
export type TCommonResult<T> = {
  status: 0 | 1;
  message: string;
  data: T | T[];
};

/**
 * 高级查询条件
 */
export type TCondition = {
  logicNode?: TLogicNode;
  orders?: TOrder[];
};

/**查询条件节点 */
export type TFilterNode = {
  /**查询条件名称 */
  name?: string;
  /**比较操作符编码 */
  operatorCode?: EOperatorCode;
  /**查询参数 */
  filterParams?: TcdtType[] | any[];
};

/**逻辑操作节点 */
export type TLogicNode = {
  /**逻辑操作编码 */
  logicOperatorCode?: ELogicOperatorCode;
  /**子节点 */
  logicNode?: TLogicNode;
  /**查询条件集合 */
  filterNodes?: TFilterNode[];
};

/**排下字段 */
export type TOrder = {
  direction: EDirection;
  property: string;
  ignoreCase: boolean;
};

/**分页查询条件 */
export type TPageInfoInput = {
  logicNode?: TLogicNode;
  orders?: TOrder[];
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
};

/**分页结果 */
export type TPageInfo<T> = {
  pageInfoInput: TPageInfoInput;
  dataList?: T[];
};

/**公共字段 */
export type TAudit = {
  // [key: string]: any;
  createId?: string;
  creator?: string;
  createTime?: string;
  updateId?: string;
  updator?: string;
  updateTime?: string;
  action?: DOStatus;
};

/**
 * 树节点
 */
export type TTree = {
  [x: string]: any;
  key: string;
  title?: string;
  /**父模块id */
  idParent?: string;
  /**子树 */
  children?: TTree[];
};

function switchFilterValue(sourceFilterNodes: TFilterNode[]) {
  let newFilterNodes: TFilterNode[] = [];
  const fgRust = window.localStorage.getItem('service') === 'Rust';
  if (fgRust) {
    newFilterNodes = sourceFilterNodes.map((sourceFilterNode) => {
      const targetFilterNode: TFilterNode = {
        ...sourceFilterNode,
        filterParams: sourceFilterNode.filterParams?.map(
          (sourceFilterParam) => {
            let targestFilterParam: any = {};
            targestFilterParam[(sourceFilterParam as TcdtType).dataType] =
              sourceFilterParam.value;
            return targestFilterParam;
          },
        ),
      };
      return targetFilterNode;
    });
  } else {
    newFilterNodes = sourceFilterNodes.map((sourceFilterNode) => {
      const targetFilterNode: TFilterNode = {
        ...sourceFilterNode,
        filterParams: sourceFilterNode.filterParams?.map(
          (sourceFilterParam) => {
            let targestFilterParam: any = {};
            targestFilterParam[(sourceFilterParam as TcdtType).dataType] =
              sourceFilterParam.value;
            return sourceFilterParam.value;
          },
        ),
      };
      return targetFilterNode;
    });
  }
  return newFilterNodes;
}

export const andLogicNode = (filterNodes: TFilterNode[]) => {
  let newFilterNodes: TFilterNode[] = switchFilterValue(filterNodes);
  const result: TLogicNode = {
    logicOperatorCode: 'and',
    filterNodes: newFilterNodes,
  };

  return (childLogicNode?: TLogicNode) => {
    result.logicNode = childLogicNode;
    return result;
  };
};

export const orLogicNode = (filterNodes: TFilterNode[]) => {
  let newFilterNodes: TFilterNode[] = switchFilterValue(filterNodes);
  const result: TLogicNode = {
    logicOperatorCode: 'or',
    filterNodes: newFilterNodes,
  };
  return (childLogicNode?: TLogicNode) => {
    result.logicNode = childLogicNode;
    return result;
  };
};

const oneParamConds = [
  'like',
  'rightLike',
  'leftLike',
  'equal',
  'greaterThan',
  'lessThan',
];

export const buildFilterValueBySearchRef = (
  searchRef: TBillSearchRef,
  value: any,
) => {
  if (searchRef.valueType === 'Bool') {
    return [boolFilterParam(value)];
  }
  if (searchRef.valueType === 'I32') {
    if (oneParamConds.includes(searchRef.operatorCode!)) {
      return [i32FilterParam(value)];
    } else {
      return (value as any[]).map((v) => i32FilterParam(v));
    }
  }
  if (searchRef.valueType === 'I64') {
    if (oneParamConds.includes(searchRef.operatorCode!)) {
      return [i64FilterParam(value)];
    } else {
      return (value as any[]).map((v) => i64FilterParam(v));
    }
  }

  if (oneParamConds.includes(searchRef.operatorCode!)) {
    return [stringFilterParam(value)];
  } else {
    return (value as any[]).map((v) => stringFilterParam(v));
  }
};

export const equalFilterNode = (property: string, value: TcdtType) => {
  const result: TFilterNode = {
    operatorCode: 'equal',
    name: property,
    filterParams: [value],
  };
  return result;
};

export const likeFullFilterNode = (property: string, value: TcdtType) => {
  const result: TFilterNode = {
    operatorCode: 'like',
    name: property,
    filterParams: [value],
  };
  return result;
};

export const likeLeftFilterNode = (property: string, value: TcdtType) => {
  const result: TFilterNode = {
    operatorCode: 'leftLike',
    name: property,
    filterParams: [value],
  };
  return result;
};

export const likeRightFilterNode = (property: string, value: TcdtType) => {
  const result: TFilterNode = {
    operatorCode: 'rightLike',
    name: property,
    filterParams: [value],
  };
  return result;
};

export const greaterThanFilterNode = (property: string, value: TcdtType) => {
  const result: TFilterNode = {
    operatorCode: 'greaterThan',
    name: property,
    filterParams: [value],
  };
  return result;
};

export const lessThanFilterNode = (property: string, value: TcdtType) => {
  const result: TFilterNode = {
    operatorCode: 'lessThan',
    name: property,
    filterParams: [value],
  };
  return result;
};

export const isNullFilterNode = (property: string) => {
  const result: TFilterNode = {
    operatorCode: 'isNull',
    name: property,
    filterParams: [],
  };
  return result;
};

export const notNullFilterNode = (property: string) => {
  const result: TFilterNode = {
    operatorCode: 'notNull',
    name: property,
    filterParams: [],
  };
  return result;
};

export const inFilterNode = (property: string, values: TcdtType[]) => {
  const result: TFilterNode = {
    operatorCode: 'in',
    name: property,
    filterParams: values,
  };
  return result;
};

export const stringFilterParam = (value: string) => {
  const result: TcdtType = {
    dataType: 'String',
    value,
  };
  return result;
};

export const boolFilterParam = (value: boolean) => {
  const result: TcdtType = {
    dataType: 'Bool',
    value,
  };
  return result;
};

export const i32FilterParam = (value: number) => {
  const result: TcdtType = {
    dataType: 'I32',
    value,
  };
  return result;
};

export const i64FilterParam = (value: number) => {
  const result: TcdtType = {
    dataType: 'I64',
    value,
  };
  return result;
};
