import {
  TBillTreeRef,
  TDescriptionInfo,
} from '@/pages/Factory/Units/common/model';

type TTreeConfCommon = {
  idTree?: string;
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

export type TTreeConf = {
  /**描述数据字符串，用于保存 */
  metaData?: string;
  content?: string;
} & TTreeConfCommon;

export type TTreeContent = {
  /**描述数据 */
  metaData?: TDescriptionInfo;
  /**是否2层树 */
  twoLevelStatus?: boolean;
  /**树节点可搜索属性 */
  searchAttrs: string[];
  /**第一层树配置 */
  firstTreeRef?: TBillTreeRef;
  /**第二层树配置 */
  thirdTreeRef?: TBillTreeRef;
} & TTreeConfCommon;

export enum EActiveKey {
  firstTreeRef = 'firstTreeRef',
  thirdTreeRef = 'thirdTreeRef',
}

export type TModuleStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: TTreeContent;
  activeKey: EActiveKey;
};
