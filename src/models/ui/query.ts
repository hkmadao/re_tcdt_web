import { TBillSearchRef, TMetaData } from './';

type TQueryCommon = {
  idQuery?: string;
  /**所属项目id */
  idProject?: string;
  projectName?: string;
  /**所属子项目id */
  idSubProject?: string;
  subProjectName?: string;
  /**所属组件模块id */
  idComponentModule?: string;
  componentModuleName?: string;
  /**所属方案id */
  idComponent?: string;
  /**组件名称 */
  componentName?: string;
  name?: string;
  displayName?: string;
};

export type TQueryContent = {
  /**描述数据 */
  metaData?: TMetaData;
  /**搜索控件配置 */
  searchRefs: TBillSearchRef[];
} & TQueryCommon;
