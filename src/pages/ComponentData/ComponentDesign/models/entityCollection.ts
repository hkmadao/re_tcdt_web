import { TAudit } from '@/models';
import {
  TEntityAssociate,
  TEnumAssociate,
  TSubProject,
  TNodeUi,
  TEntity,
  TEnum,
} from '.';

/**业务方案 */
export type TEntityCollection = {
  /**方案id */
  idEntityCollection: string;
  /**所在模块id */
  idSubProject?: string;
  /**所在模块 */
  subProject?: TSubProject;
  /**名称 */
  name?: string;
  /**显示名称 */
  displayName?: string;
  /**实体集下的实体关联关系 */
  entityAssociates: TEntityAssociate[];
  /**实体集下的实体 */
  entities: TEntity[];
  nodeUis: TNodeUi[];
  /**其他实体集下的实体 */
  outEntities?: TEntity[];
  /**实体集下的枚举 */
  enums?: TEnum[];
  /**实体集下的实体和枚举关联关系 */
  enumAssociates?: TEnumAssociate[];
  /**其他实体集下的枚举 */
  outEnums?: TEnum[];
} & TAudit;
