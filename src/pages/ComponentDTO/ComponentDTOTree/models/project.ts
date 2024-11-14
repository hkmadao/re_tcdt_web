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

/**DTO模块 */
export type TDtoModule = {
  /**DTO模块id */
  idDtoModule?: string;
  /**所属模块id */
  idSubProject?: string;
  /**所属模块 */
  subProject?: TSubProject;
  /**包名 */
  path?: string;
} & TAudit &
  Common;

/**实体集简要信息 */
export type TSimpleDtoEntityCollection = {
  /**方案id */
  idDtoEntityCollection: string;
  /**所在DTO模块id */
  idDtoModule?: string;
  /**代码包名称 */
  packageName?: string;
  /**显示名称 */
  displayName?: string;
} & TAudit;

/**实体集方案 */
export type TEntityCollection = {
  /**实体集id */
  idEntityCollection: string;
  /**所在模块id */
  idSubProject?: string;
  /**所在模块 */
  subProject?: TSubProject;
  /**代码包名称 */
  packageName?: string;
  /**显示名称 */
  displayName?: string;
  /**实体集下的实体 */
  entities: TEntity[];
  /**实体集下的枚举 */
  enums: TEnum[];
  /**其他实体集下的实体 */
  outEntities: TEntity[];
} & TAudit;

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
  /**实体id */
  idEntity?: string;
  /**长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**序号 */
  sn?: number;
  idInterfaceAttribute?: string;
} & TAudit;

/**枚举 */
export type TEnum = {
  idEnum: string;
  idEntityCollection?: string;
  /**枚举值类型 */
  enumValueType?: 'Int' | 'String';
  /**类名称 */
  className?: string;
  /**枚举中文名称 */
  displayName?: string;
  /**枚举下属性集合 */
  attributes?: TEnumAttribute[];
} & TAudit;

/**枚举属性 */
export type TEnumAttribute = {
  /**枚举属性id */
  idEnumAttribute?: string;
  /**枚举属性显示名称 */
  displayName?: string;
  /**枚举属性编码 */
  code?: string;
  /**枚举值 */
  enumValue?: string;
  /**枚举id */
  idEnum?: string;
  /**序号 */
  sn?: number;
} & TAudit;
