import { TBillSearchRef, TBillTreeRef } from '.';

/**列配置 */
export type TBillRefColumn = {
  idBillRefColumn: string;
  /**列属性 */
  name?: string;
  /**列显示属性 */
  displayName?: string;
  /**列数据类型 */
  dataType?: string;
};

/**表格配置 */
export type TTableRef = {
  /**表格引用树的属性的键，表格存放树的外键的属性 */
  treeRefMainKey?: string;
  /**表格主属性，表格数据的id属性 */
  tableMainProp: string;
  /**分页标志 */
  fgPage?: boolean;
  /**ref请求数据uri */
  dataUri?: string;
  /**ref表格列配置 */
  refColumns?: TBillRefColumn[];
  searchRefs?: TBillSearchRef[];
  /**关联组件实体id */
  idComponentEntity?: string;
  /**关联实体显示名称 */
  ceDisplayName?: string;
};

/**参照拾取器配置 */
export type TBillRef = {
  idBillRef?: string;
  /**ref弹出框标题 */
  title?: string;
  /**样式，treeTable: 树表; table: 表格 */
  refStyle: 'treeTable' | 'table' | 'tree';
  /**回写输入框属性 */
  backWriteProp?: string;
  /**输入框显示属性 */
  displayProp?: string;
  /**树配置 */
  billTreeRef?: TBillTreeRef;
  /**表格配置 */
  tableRef?: TTableRef;
};
