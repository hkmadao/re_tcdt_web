import { TAudit, TCommonResult } from '@/models';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import {
  TComponentEntityAssociate,
  TComponentNodeUi,
  TEnumAssociate,
  TComponentEntity,
  TEntity,
  TEnum,
  TAttributeType,
  TComponentMethod,
} from '.';
import { EnumComponentType } from '../conf';
import { TComponentEnum } from './componentEnum';

/**子项目 */
export type TSubProject = {
  /**子项目id */
  idSubProject: string;
  /**所属项目id */
  idProject?: string;
} & TAudit;

/**组件模块 */
export type TComponentModule = {
  /**组件模块id */
  idComponentModule: string;
  /**所属模块id */
  idSubProject: string;
  /**所属模块 */
  subProject: TSubProject;
  /**包名 */
  path?: string;
} & TAudit;

export type TDeleteRefErrorMessage = {
  idData: string;
  message: string;
  sourceClassName: string;
  refClassName: string;
};

/** 組件保存返回数据 */
export type TComponentSaveResult = TCommonResult<
  TComponent | TDeleteRefErrorMessage[]
>;

/**组件 */
export type TComponent = {
  /**方案id */
  idComponent?: string;
  /**所在组件模块id */
  idComponentModule?: string;
  /**所在组件模块 */
  componentModule?: TComponentModule;
  /**主实体id */
  idMainComponentEntity?: string;
  /**显示名称 */
  displayName?: string;
  /**包名称 */
  packageName?: string;
  /**组件类型 */
  componentType?: EnumComponentType;
  /**组件实体关联关系 */
  componentEntityAssociates?: TComponentEntityAssociate[];
  /**组件实体集合*/
  componentEntities?: TComponentEntity[];
  componentEnums?: TComponentEnum[];
  componentNodeUis?: TComponentNodeUi[];
  /**组件方法*/
  componentMethods?: TComponentMethod[];
  /**父模块 */
  parent?: TTree;
  /**其他实体集下的实体 */
  outEntities?: TEntity[];
  /**实体集下的枚举 */
  enums?: TEnum[];
  /**实体集下的实体和枚举关联关系 */
  enumAssociates?: TEnumAssociate[];
  /**其他实体集下的枚举 */
  outEnums?: TEnum[];
  /**系统数据类型 */
  sysDataTypes?: TAttributeType[];
} & TAudit;
