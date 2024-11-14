import { TAudit } from '@/models';
import { EnumTreeNodeType } from '../conf';

type Common = {
  level?: EnumTreeNodeType;
  /**根目录名称 */
  name?: string;
  /**根目录显示名称 */
  displayName?: string;
};

/**根目录 */
export type TRoot = {
  /**根目录id */
  idRoot?: string;
} & Common;

/**项目 */
export type TProject = {
  /**项目id */
  idProject?: string;
  /**项目模板编号 */
  templateCode?: string;
  /**文件名样式 */
  fileNameType?: string;
  /**项目编号 */
  code?: string;
  /**项目说明 */
  note?: string;
} & TAudit &
  Common;

/**子项目 */
export type TSubProject = {
  /**子项目id */
  idSubProject?: string;
  /**所属项目id */
  idProject?: string;
} & TAudit &
  Common;

/**实体集简要信息 */
export type TSimpleEntityCollection = {
  /**方案id */
  idEntityCollection: string;
  /**所在模块id */
  idSubProject?: string;
  /**名称 */
  name?: string;
  /**显示名称 */
  displayName?: string;
  /**服务名称空间 */
  basePath?: string;
} & TAudit;
