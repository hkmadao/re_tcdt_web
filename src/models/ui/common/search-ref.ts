import { EOperatorCode } from '@/models/enums';
import { EInputType, EValueType, TBillRef, TEnumRef } from '.';

/**搜索控件配置 */
export type TBillSearchRef = {
  idBillSearchRef: string;
  /**搜索框操作符 */
  operatorCode?: EOperatorCode;
  /**搜索框label */
  label?: string;
  /**输入框属性名称 */
  attributeName?: string;
  /**引用属性名称 */
  refAttributeName?: string;
  /**搜索框属性 */
  searchAttributes?: string[];
  /**搜索框类型 */
  htmlInputType?: EInputType;
  valueType?: EValueType;
  defaultValue?: string;
  showOrder: number;
  /**枚举配置 */
  enumConfig?: TEnumRef;
  /**参照拾取器配置 */
  refConfig?: TBillRef;
};
