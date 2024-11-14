import { TAudit } from '@/models';

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
