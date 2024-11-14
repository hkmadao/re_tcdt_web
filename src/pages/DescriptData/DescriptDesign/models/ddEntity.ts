import { TAudit } from '@/models';
import { TAttributeType } from '.';

/**实体 */
export type TEntity = {
  idEntity: string;
  idEntityCollection?: string;
  /**表名称 */
  tableName?: string;
  /**类名称 */
  className?: string;
  /**实体中文名称 */
  displayName?: string;
  /**实体主属性类型Code */
  pkAttributeCode?: string;
  /**实体主属性名称 */
  pkAttributeName?: string;
  /**实体主属性类型名称 */
  pkAttributeTypeName?: string;
  /**实体下属性集合 */
  attributes?: TAttribute[];
} & TAudit;

/**实体属性 */
export type TAttribute = {
  /**属性id */
  idAttribute?: string;
  /**主键标识 */
  fgPrimaryKey?: Boolean;
  /**是否可空 */
  fgMandatory?: Boolean;
  /**默认值 */
  defaultValue?: string;
  /**字段名称 */
  columnName?: string;
  /**字段中文名称 */
  displayName?: string;
  /**字段属性 */
  attributeName?: string;
  /**字段备注 */
  note?: string;
  /**属性类型id */
  idAttributeType?: string;
  /**属性类型冗余名称 */
  attributeTypeName?: string;
  /**属性类型 */
  attributeType?: TAttributeType;
  /**实体id */
  idEntity?: string;
  /**长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**序号 */
  sn?: number;
} & TAudit;
