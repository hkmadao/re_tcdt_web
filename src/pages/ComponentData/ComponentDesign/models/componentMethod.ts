import { TAudit } from '@/models';
import { ECURD, ENumberType, EPublishType, ETypeStyle } from '../conf';
import { TAttributeType } from './dataType';

/**方法 */
export type TComponentMethod = {
  /**方法id */
  idComponentEoMethod?: string;
  /**组件实体操作id */
  idComponentEo?: string;
  /**方法名称 */
  name?: string;
  /**字段显示名称 */
  displayName?: string;
  /**CRUD */
  crud?: ECURD;
  /**调用名 */
  alias?: string;
  /**字段备注 */
  note?: string;
  /**类型 */
  type?: EPublishType;
  /**返回参数 */
  cemr?: TComponentMethodReturn;
  /**入参 */
  cemps?: TComponentMethodParam[];
  /**序号 */
  sn?: number;
  /**方法实现内容 */
  implContent?: string;
} & TAudit;

/**返回参数 */
export type TComponentMethodReturn = {
  /**返回参数id */
  idComponentEoMethodReturn: string;
  /**方法id */
  idComponentEoMethod?: string;
  /**参数名称 */
  name?: string;
  /**属性名称 */
  attributeName?: string;
  /**参数类型样式 */
  refType?: ENumberType;
  /**是否聚合 */
  fgAgg?: string;
  /**参数描述 */
  note?: string;
  /**可空 */
  fgMandatory?: Boolean;
  /**长度 */
  len?: string;
  /**精度 */
  pcs?: string;
  /**参数类型id */
  idParamType?: string;
  /**属性类型 */
  attributeType?: TAttributeType;
  /**属性样式 */
  typeStyle?: ETypeStyle;
  /**参数类型全路径 */
  fullClassName?: string;
  /**对象类型包名*/
  entityTypePackage?: string;
  /**参数类名称 */
  entityClassName?: string;
} & TAudit;

/**入参 */
export type TComponentMethodParam = {
  /**参数id */
  idComponentEoMethodParam: string;
  /**方法id */
  idComponentEoMethod?: string;
  /**参数名称 */
  name?: string;
  /**属性名称 */
  attributeName?: string;
  /**参数类型样式 */
  refType?: string;
  /**是否聚合 */
  fgAgg?: string;
  /**参数描述 */
  note?: string;
  /**可空 */
  fgMandatory?: Boolean;
  /**长度 */
  len?: string;
  /**精度 */
  pcs?: string;
  /**参数类型id */
  idParamType?: string;
  /**属性类型 */
  attributeType?: TAttributeType;
  /**序号 */
  sn?: number;
  /**属性样式 */
  typeStyle?: ETypeStyle;
  /**返回类型全路径 */
  fullClassName?: string;
  /**对象类型包名*/
  entityTypePackage?: string;
  /**返回类名称 */
  entityClassName?: string;
} & TAudit;
