import { TBillTreeRef } from './';

type TTreeConfCommon = {
  idTree?: string;
  /**所属项目id */
  idProject?: string;
  projectName?: string;
  /**所属子项目id */
  idSubProject?: string;
  subProjectName?: string;
  name?: string;
  displayName?: string;
};

/**左树配置 */
export type TTreeContent = {
  /**是否2层树 */
  twoLevelStatus?: boolean;
  /**树节点可搜索属性 */
  searchAttrs: string[];
  /**第一层树配置 */
  firstTreeRef?: TBillTreeRef;
  /**第二层树配置 */
  thirdTreeRef?: TBillTreeRef;
} & TTreeConfCommon;
