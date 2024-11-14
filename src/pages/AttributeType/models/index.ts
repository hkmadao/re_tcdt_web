import { TAudit } from '@/models';

/**数据类型 */
export type TDataType = {
  /**数据类型id */
  idDataType?: string;
  /**数据类型编码 */
  code?: string;
  /**显示名称 */
  displayName?: string;
  /**备注 */
  note?: string;
  /**序列号 */
  sn?: number;
  /**长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**字段类型 */
  columnType?: string;
  /**对象类型名称 */
  objectType?: string;
  /**对象类型包名 */
  objectTypePackage?: string;
  /**扩展属性1 */
  ext1?: string;
  /**扩展属性2 */
  ext2?: string;
  /**扩展属性3 */
  ext3?: string;
  /**扩展属性4 */
  ext4?: string;
  /**扩展属性5 */
  ext5?: string;
  /**扩展属性6 */
  ext6?: string;
  /**默认值 */
  defaultValue?: string;
  /**必填标志 */
  fgMandatory?: boolean;
  /**TypeScript类型 */
  typeScriptType?: string;
  /**HTML5输入框类型 */
  webInputType?: string;
  /**系统预置数据标识 */
  fgPreset?: boolean;
  /**项目 */
  project?: TProject;
  idProject?: string;
  /**数据类型 */
  commonAttributes?: TCommonAttribute;
  /**数据类型 */
  attributes?: TEntityAttribute;
  /**数据类型 */
  dtoComputationAttributes?: TDtoComputationAttribute;
  /**数据类型 */
  dtoEntityAttributes?: TDtoEntityAttribute;
  /**属性类型id */
  computationAttributes?: TComputationAttribute;
} & TAudit;
/**项目 */
export type TProject = {
  /**项目编号 */
  code?: string;
  /**文件名样式 */
  fileNameType?: string;
  /**项目模板编号 */
  templateCode?: string;
  /**项目id */
  idProject?: string;
  /**系统路径 */
  path?: string;
  /**显示名称 */
  displayName?: string;
  /**备注 */
  note?: string;
} & TAudit;
/**公共属性 */
export type TCommonAttribute = {
  /**属性名称 */
  attributeName?: string;
  /**字段名称 */
  columnName?: string;
  /**属性类别 */
  category?: string;
  /**引用属性名称 */
  refAttributeName?: string;
  /**是否必填 */
  fgMandatory?: boolean;
  /**显示名称 */
  displayName?: string;
  /**数据长度 */
  len?: number;
  /**序号 */
  sn?: number;
  /**属性id */
  idCommonAttribute?: string;
  /**系统预置数据标识 */
  fgPreset?: boolean;
  /**默认值 */
  defaultValue?: string;
  /**精度 */
  pcs?: number;
  /**引用属性显示名称 */
  refDisplayName?: string;
} & TAudit;
/**属性 */
export type TEntityAttribute = {
  /**精度 */
  pcs?: number;
  /**属性名称 */
  attributeName?: string;
  /**是否主键 */
  fgPrimaryKey?: boolean;
  /**显示名称 */
  displayName?: string;
  /**数据长度 */
  len?: number;
  /**分类 */
  category?: string;
  /**备注 */
  note?: string;
  /**字段名称 */
  columnName?: string;
  /**序号 */
  sn?: number;
  /**属性id */
  idAttribute?: string;
  /**是否必填 */
  fgMandatory?: boolean;
  /**默认值 */
  defaultValue?: string;
} & TAudit;
/**DTO计算属性 */
export type TDtoComputationAttribute = {
  /**默认值 */
  defaultValue?: string;
  /**精度 */
  pcs?: string;
  /**显示名称 */
  displayName?: string;
  /**序号 */
  sn?: string;
  /** DTO计算属性id */
  idDtoComputationAttribute?: string;
  /**备注 */
  note?: string;
  /**是否必填 */
  fgMandatory?: boolean;
  /**数据长度 */
  len?: number;
  /**属性名称 */
  attributeName?: string;
} & TAudit;
/**DTO实体属性 */
export type TDtoEntityAttribute = {
  /**序号 */
  sn?: number;
  /**默认值 */
  defaultValue?: string;
  /**备注 */
  note?: string;
  /**数据长度 */
  len?: number;
  /**字段名称 */
  columnName?: string;
  /**是否主键 */
  fgPrimaryKey?: boolean;
  /**DTO实体属性id */
  idDtoEntityAttribute?: string;
  /**类型 */
  category?: string;
  /**属性名称 */
  attributeName?: string;
  /**精度 */
  pcs?: number;
  /**显示名称 */
  displayName?: string;
  /**是否必填 */
  fgMandatory?: boolean;
} & TAudit;
/**计算属性 */
export type TComputationAttribute = {
  /**属性名称 */
  attributeName?: string;
  /**数据长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**是否必填 */
  fgMandatory?: boolean;
  /**序号 */
  sn?: number;
  /**显示名称 */
  displayName?: string;
  /**默认值 */
  defaultValue?: string;
  /**计算属性id */
  idComputationAttribute?: string;
} & TAudit;