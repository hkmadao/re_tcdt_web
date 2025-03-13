import { TAudit } from '@/models';
import { EnumDownAssociateType, EnumUpAssociateType } from '../conf';

/**实体关联 */
export type TDtoEntityAssociate = {
  idDtoEntityAssociate?: string;
  /** 所在实体集id*/
  idDtoEntityCollection?: string;
  /**上级实体id */
  idUp?: string;
  /**下级实体id */
  idDown?: string;
  /**上级关系 */
  upAssociateType?: EnumUpAssociateType;
  /**下级关系 */
  downAssociateType?: EnumDownAssociateType;
  /**两个实体多条连线时，连线的序号 */
  groupOrder?: number;
  /**下级实体属性名称 */
  downAttributeName?: string;
  /**下级实体属性显示名称 */
  downAttributeDisplayName?: string;
  /**引用实体属性 */
  refAttributeName?: string;
  /**引用实体属性显示名称 */
  refAttributeDisplayName?: string;
  /**外键字段名称（对应数据库外键） */
  fkColumnName?: string;
  /**外键属性 */
  fkAttributeName?: string;
  /**外键属性显示名称 */
  fkAttributeDisplayName?: string;
  /**是否系统引用连线 */
  fgSysRef?: boolean;
} & TAudit;
