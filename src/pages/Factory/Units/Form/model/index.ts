import { TAudit } from '@/models';
import {
  TBillSearchRef,
  TBillTreeRef,
  TDescriptionInfo,
} from '@/pages/Factory/Units/common/model';
import { TBillFormConfigForm, TBillFormSelectData } from './billform';
import { TTableBillFormConfigList } from './billTable';

export * from './billform';
export * from './billTable';
export * from './conf';

export type TTip = {
  tipKey: string;
  tip: string;
};

/**表单信息 */
declare type TBillFormCommon = {
  idBillForm?: string;
  /**所属项目id */
  idProject?: string;
  projectName?: string;
  /**所属子项目id */
  idSubProject?: string;
  subProjectName?: string;
  /**所属组件模块id */
  idComponentModule?: string;
  componentModuleName?: string;
  /**组件id */
  idComponent?: string;
  /**组件名称 */
  componentName?: string;
  /**表单类型 */
  billFormType?: 'Single' | 'Combination';
  name?: string;
  displayName?: string;
} & TAudit;

/**表单信息 */
export type TBillForm = {
  metaData?: string;
  /**表单的实际内容，用json字符串存放 */
  content?: string;
} & TBillFormCommon;

/**表单配置内容 */
export type TBillFormContent = {
  /**描述数据 */
  metaData?: TDescriptionInfo;
  /**左树树引用引用 */
  treeRef?: TBillTreeRef;
  /**搜索控件配置 */
  searchRefs?: TBillSearchRef[];
  /**列表配置内容 */
  configList?: TTableBillFormConfigList;
  /**表单配置内容 */
  configForm?: TBillFormConfigForm;
} & TBillFormCommon;

export type TModuleStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /**是否表单编辑 */
  fgForm: boolean;
  tip?: TTip;
  data: TBillFormContent;
  current?: TBillFormSelectData;
};
