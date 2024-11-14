import { TAudit } from '@/models';
import { TEntity, TAttribute, TAttributeType } from '.';

/**组件实体 */
export type TComponentEntity = {
  idComponentEntity: string;
  /**组合实体组件下的组件实体都是虚拟虚拟实体 */
  fgVirtual?: Boolean;
  /**组件id */
  idComponent?: string;
  /**实体id */
  idEntity?: string;
  /**实体 */
  ddEntity?: TEntity;
  /**组件实体下属性集合 */
  extAttributes?: TExtAttribute[];
  /**组件实体下计算属性集合 */
  computationAttributes?: TComputationAttribute[];
} & TAudit;

/**组件实体属性 */
export type TExtAttribute = {
  /**组件实体属性id */
  idExtAttribute: string;
  /**属性id */
  idAttribute?: string;
  /**属性 */
  attribute?: TAttribute;
  /**组件实体id */
  idComponentEntity?: string;
  /**序号 */
  sn?: number;
} & TAudit;

/**组件实体计算属性 */
export type TComputationAttribute = {
  /**计算属性id */
  idComputationAttribute: string;
  /**组件实体id */
  idComponentEntity?: string;
  /**属性名称 */
  attributeName?: string;
  /**属性显示名称 */
  displayName?: string;
  /**属性备注 */
  note?: string;
  /**是否可空 */
  fgMandatory?: Boolean;
  /**默认值 */
  defaultValue?: string;
  /**属性类型id */
  idAttributeType?: string;
  /**属性类型 */
  attributeType?: TAttributeType;
  /**长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**序号 */
  sn?: number;
} & TAudit;
