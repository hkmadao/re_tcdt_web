import { TAudit } from '@/models';
import { EnumTreeNodeType } from '../conf';
import { TComponent } from '../../ComponentDesign/models';

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

/**组件模块 */
export type TComponentModule = {
  /**组件模块id */
  idComponentModule?: string;
  /**所属模块id */
  idSubProject?: string;
  /**子项目包名 */
  path?: string;
} & TAudit &
  Common;

/**组件实体集文件夹 */
export type TComponentEntityFolder = {
  /**虚拟文件夹id */
  idVirtualFolder?: string;
  /**所属组件模块id */
  idComponentModule?: string;
} & TAudit &
  Common;

/**足迹操作集文件夹 */
export type TComponentEoFolder = {
  /**虚拟文件夹id */
  idVirtualFolder?: string;
  /**所属组件模块id */
  idComponentModule?: string;
} & TAudit &
  Common;

/**组件 */
export type TVirtualComponent = {
  /**组件id */
  idVirtualComponent?: string;
  /**所属组件模块id */
  idComponentModule?: string;
} & TAudit &
  Common;

/**组件实体集 */
export type TComponentEntityCollection = {
  /**组件实体集id */
  idComponent?: string;
  /**所属组件模块id */
  idComponentModule?: string;
  componentType?: string;
} & TComponent &
  TAudit &
  Common;

/**组件操作集 */
export type TComponentEoCollection = {
  /**组件操作集id */
  idComponentEoCollection?: string;
  /**所属组件模块id */
  idComponentModule?: string;
} & TAudit &
  Common;
