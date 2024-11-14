import { TAudit } from '@/models';
import { TAttributeType } from '.';

/**DTO实体 */
export type TDtoEntity = {
  idDtoEntity: string;
  idDtoEntityCollection?: string;
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
  deAttributes?: TDtoEntityAttribute[];
  /**实体下计算属性集合 */
  dcAttributes?: TDtoComputationAttribute[];
  /**引用实体id */
  idRef?: string;
  /**引用实体 */
  refEntity?: Pick<TDtoEntity, 'tableName' | 'className' | 'displayName'> & {
    idEntity: string;
  };
} & TAudit;

/**DTO实体属性 */
export type TDtoEntityAttribute = {
  /**属性id */
  idDtoEntityAttribute?: string;
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
  idDtoEntity?: string;
  /**长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**序号 */
  sn?: number;
  idInterfaceAttribute?: string;
  /**引用实体属性id */
  idRefAttribute?: string;
} & TAudit;

/**DTO实体计算属性 */
export type TDtoComputationAttribute = {
  /**属性id */
  idDtoComputationAttribute?: string;
  /**是否可空 */
  fgMandatory?: Boolean;
  /**默认值 */
  defaultValue?: string;
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
  idDtoEntity?: string;
  /**长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**序号 */
  sn?: number;
} & TAudit;
