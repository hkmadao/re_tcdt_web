import { TBillSearchRef, TBillTreeRef, TMetaData } from '..';
import { TTableBillFormConfigList } from './table';
import { TBillFormConfigForm } from './form';

export * from './form';
export * from './table';
export * from './enums';
export * from './value-enum';

/**表单配置内容 */
export type TBillFormContent = {
  idBillForm?: string;
  /**所属方案id */
  idComponent?: string;
  /**组件名称 */
  componentName?: string;
  name?: string;
  displayName?: string;
  /**描述数据 */
  metaData?: TMetaData;
  /**左树树引用引用 */
  treeRef?: TBillTreeRef;
  /**搜索控件配置 */
  searchRefs?: TBillSearchRef[];
  /**列表配置内容 */
  configList?: TTableBillFormConfigList;
  /**表单配置内容 */
  configForm?: TBillFormConfigForm;
};
