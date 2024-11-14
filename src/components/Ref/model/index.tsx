import { TBillRef, TFilterNode, TPageInfo } from '@/models';
import { Key } from 'react';

export type TRefProps = {
  gridFixedFilterNodes?: TFilterNode[];
  treeFixedFilterNodes?: TFilterNode[];
  value?: any;
  onChange?: any;
} & TBillRef;

export type TModuleStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /**配置数据 */
  refProps?: TRefProps;
  /**搜索条件数据 */
  searchValues?: any[];
  treeData?: any[];
  /**表格数据 */
  pageInfo?: TPageInfo<any>;
  /**当前选中树节点Key */
  selectedNodeKeys?: Key[];
  /**当前选中行Key */
  selectedRowKeys?: Key[];
  /**当前选中树节点 */
  selectedNodes?: any[];
  /**当前选中行 */
  selectedRows?: any[];
};
