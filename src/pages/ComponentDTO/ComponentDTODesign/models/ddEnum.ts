import { TAudit } from '@/models';

/**枚举 */
export type TDtoEnum = {
  idDtoEnum: string;
  idDtoEntityCollection?: string;
  /**枚举值类型 */
  enumValueType?: 'Int' | 'String';
  /**类名称 */
  className?: string;
  /**枚举中文名称 */
  displayName?: string;
  /**枚举下属性集合 */
  dtoEnumAttributes?: TDtoEnumAttribute[];
  /**引用枚举id */
  idRef?: string;
  /**引用枚举 */
  refEnum?: Pick<TDtoEnum, 'className' | 'displayName'> & {
    idEnum: string;
  };
} & TAudit;

/**枚举属性 */
export type TDtoEnumAttribute = {
  /**枚举属性id */
  idDtoEnumAttribute?: string;
  /**枚举属性显示名称 */
  displayName?: string;
  /**枚举属性编码 */
  code?: string;
  /**枚举值 */
  enumValue?: string;
  /**枚举id */
  idDtoEnum?: string;
  /**序号 */
  sn?: number;
  /**引用枚举属性id */
  idRef?: string;
} & TAudit;
