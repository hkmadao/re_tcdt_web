import { TAudit, TCommonResult } from '@/models';
import {
  TEntity,
  TEnum,
  TEntityAssociate,
  TEnumAssociate,
  TNodeUi,
  TAttributeType,
  TCommonAttribute,
} from '.';
import { TSubProject } from '../../DescriptTree/models';

export type TDeleteRefErrorMessage = {
  idData: string;
  message: string;
  sourceClassName: string;
  refClassName: string;
};

/** 实体集数据 */
export type TEntityCollectionSaveResult = TCommonResult<
  TEntityCollection | TDeleteRefErrorMessage[]
>;

/**业务方案 */
export type TEntityCollection = {
  /**方案id */
  idEntityCollection: string;
  /**所在模块id */
  idSubProject?: string;
  /**所在模块 */
  subProject?: TSubProject;
  /**名称 */
  packageName?: string;
  /**显示名称 */
  displayName?: string;
  /**实体集下的实体关联关系 */
  entityAssociates: TEntityAssociate[];
  /**实体集下的实体 */
  entities: TEntity[];
  nodeUis: TNodeUi[];
  /**其他实体集下的实体 */
  outEntities: TEntity[];
  /**实体集下的枚举 */
  enums: TEnum[];
  /**实体集下的实体和枚举关联关系 */
  enumAssociates: TEnumAssociate[];
  /**其他实体集下的枚举 */
  outEnums: TEnum[];
  /**系统数据类型 */
  sysDataTypes: TAttributeType[];
  /**系统公共字段 */
  commonAttributes: TCommonAttribute[];
} & TAudit;
