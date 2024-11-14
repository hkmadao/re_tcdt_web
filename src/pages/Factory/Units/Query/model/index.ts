import {
  TBillSearchRef,
  TDescriptionInfo,
} from '@/pages/Factory/Units/common/model';

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

export type TQuery = {
  /**描述数据字符串，用于保存 */
  metaData?: string;
  content?: string;
} & TQueryCommon;

export type TQueryContent = {
  /**描述数据 */
  metaData?: TDescriptionInfo;
  /**搜索控件配置 */
  searchRefs: TBillSearchRef[];
} & TQueryCommon;

export type TModuleStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: TQueryContent;
  current?: {
    type: 'field' | 'panel';
    id: string;
  };
};
