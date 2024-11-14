import { TAudit } from '@/models';

/**实体枚举关联 */
export type TEnumAssociate = {
  idEnumAssociate?: string;
  /**
   * 所在方案id
   */
  idEntityCollection?: string;
  /**实体id */
  idEntity?: string;
  /**枚举id */
  idEnum?: string;
  /**实体属性id */
  idAttribute?: string;
  /**两个相同实体和枚举多条连线时，连线的序号 */
  groupOrder?: number;
} & TAudit;
