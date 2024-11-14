import { TAudit } from '@/models';
import { TAttribute, TComputationAttribute, TEntity, TExtAttribute } from '.';

/**关联关系的映射字段 */
export type TJoin = {
  idJoin?: string;
  refId?: string;
  sourceId?: string;
  idEntityAssociate?: string;
} & TAudit;

/**实体关联 */
export type TEntityAssociate = {
  idEntityAssociate?: string;
  /** 所在实体集id*/
  idEntityCollection?: string;
  /**上级实体id */
  idUp?: string;
  upEntity?: TEntity;
  /**下级实体id */
  idDown?: string;
  downEntity?: TEntity;
  /**上级关系 */
  upAssociateType?: string;
  /**下级关系 */
  downAssociateType?: string;
  /**关联关系的映射字段 */
  joins?: TJoin[];
  /**两个实体多条连线时，连线的序号 */
  groupOrder?: number;
  /**下级实体属性名称 */
  downAttributeName?: string;
  /**下级实体属性显示名称 */
  downAttributeDisplayName?: string;
  /**引用实体属性 */
  refAttributeName?: string;
  /**引用实体属性显示名称 */
  refAttributeDisplayName?: string;
  /**外键字段名称（对应数据库外键） */
  fkColumnName?: string;
  /**外键属性 */
  fkAttributeName?: string;
  /**外键属性显示名称 */
  fkAttributeDisplayName?: string;
} & TAudit;

/**组件关联关系 */
export type TComponentEntityAssociate = {
  idComponentEntityAssociate: string;
  /**是否agg关系连线 */
  fgAggAsso: Boolean;
  /** 所在组件id */
  idComponent?: string;
  idEntityAssociate?: string;
  entityAssociate?: TEntityAssociate;
  /**关联字段 */
  joinColumns?: TJoinColumn[];
  /**上级组件实体id */
  idUpCpEntity?: string;
  /**上级组件实体 */
  upCpEntity?: TSimCpEntity;
  /**下级组件实体id */
  idDownCpEntity?: string;
  /**下级组件实体 */
  downCpEntity?: TSimCpEntity;
} & TAudit;

/**引用属性关联字段 */
export type TJoinColumn = {
  idJoinColumn: string;
  /**组件实体连线id */
  idComponentEntityAssociate?: string;
  /**属性名称 */
  attributeName?: string;
  /**字段名称 */
  columnName?: string;
  /**名称 */
  name?: string;
  /**被关联字段id */
  idRef?: string;
} & TAudit;

/**组件实体简要信息 */
export type TSimCpEntity = {
  idComponentEntity: string;
  /**实体id */
  idEntity?: string;
  /**实体 */
  ddEntity?: TEntity;
  /**类名称 */
  className?: string;
  /**组件id */
  idComponent?: string;
  /**组件名称 */
  componentName?: string;
  /**组件模块名称 */
  componentModuleName?: string;
  /**组件包名 */
  packageName?: string;
};
