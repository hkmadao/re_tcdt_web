import { TAudit } from '@/models';

/**实体枚举关联 */
export type TDtoEnumAssociate = {
  idDtoEnumAssociate?: string;
  /** DTO实体集id */
  idDtoEntityCollection?: string;
  /**实体id */
  idDtoEntity?: string;
  /**枚举id */
  idDtoEnum?: string;
  /**实体属性id */
  idDtoEntityAttribute?: string;
  /**两个相同实体和枚举多条连线时，连线的序号 */
  groupOrder?: number;
} & TAudit;
