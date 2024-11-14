import { TTree } from '@/models';
import { TRole } from '../../../../models';
import { Key } from 'react';
export type TTableStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /**页面配置id */
  idUiConf?: string;
  /**组件是否是禁用状态 */
  fgDisabled: boolean;
  /**当前页面编号 */
  tableData?: TRole[];
  selectedRowKeys?: Key[];
  selectedTreeNode?: TTree;
  searchData?: { [x in string]: any };
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
};
