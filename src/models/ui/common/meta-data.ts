import { ReactNode } from 'react';
import { EInputType } from '.';

/**表描述信息 */
export type TMetaData = {
  key: string | number;
  parentKey?: string;
  title?: ReactNode | ((nodeData: any) => ReactNode);
  children?: TMetaData[];
  /**属性id */
  id?: string;
  /**中文名称 */
  displayName?: string;
  /**属性名称 */
  attributeName?: string;
  /**引用属性名称 */
  refAttributeName?: string;
  /**全属性名称 */
  fullAttributeName?: string;
  /**数据类型 */
  attributeTypeName?: string;
  /**是否同一个组件下的实体 */
  fgPartner?: boolean;
  /**是否主键 */
  fgPrimaryKey?: boolean;
  /**属性数组类型 */
  numberType?: 'Single' | 'Array';
  /**前端输入框类型 */
  webInputType?: EInputType;
  /**前端TypeScript数据类型 */
  typeScriptType?: string;
  /**属性关联实体信息 */
  entityInfo?: TEntityInfo;
  /**属性关联枚举信息 */
  enumInfo?: TEnumInfo;
};

/**枚举 */
export type TEnumInfo = {
  idEnum: string;
  /**枚举值类型 */
  enumValueType?: 'Int' | 'String';
  /**类名称 */
  className?: string;
  /**枚举中文名称 */
  displayName?: string;
  /**枚举下属性集合 */
  attributes?: TEnumAttributeInfo[];
};

/**枚举属性 */
export type TEnumAttributeInfo = {
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
};

export type TEntityInfo = {
  idEntity?: string;
  idCompEntity?: string;
  name?: string;
  displayName?: string;
  className?: string;
  component?: TComponentInfo;
  attributes?: TAttributeInfo[];
  pkAttribute?: TAttributeInfo;
};

export type TAttributeInfo = {
  idAttribute?: string;
  name?: string;
  /**属性名称 */
  attributeName?: string;
  /**引用属性名称 */
  refAttributeName?: string;
  displayName?: string;
  columnName?: string;
  dataType?: string;
  fgMandatory?: boolean;
  fgPrimaryKey?: boolean;
  idEntity?: string;
  /**排序 */
  sn?: number;
};

export type TComponentInfo = {
  idComponent?: string;
  name?: string;
  displayName?: string;
  basePath?: string;
};
