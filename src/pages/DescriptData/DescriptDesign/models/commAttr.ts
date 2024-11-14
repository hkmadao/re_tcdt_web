import { TAudit } from '@/models';
import { TAttributeType, TEntity } from '.';

/**公共属性 */
export type TCommonAttribute = {
  /**属性id */
  idCommonAttribute?: string;
  /**属性名称 */
  attributeName?: string;
  /**显示名称 */
  displayName?: string;
  /**字段名称 */
  columnName?: string;
  /**默认值 */
  defaultValue?: string;
  /**是否必填 */
  fgMandatory?: boolean;
  /**数据长度 */
  len?: number;
  /**精度 */
  pcs?: number;
  /**序号 */
  sn?: number;
  /**引用属性名称 */
  refAttributeName?: string;
  /**引用属性显示名称 */
  refDisplayName?: string;
  /**属性类别 */
  category?: string;
  /**数据类型 */
  dataType?: TAttributeType;
  idDataType?: string;
  /**项目 */
  // project?: TProject;
  idProject?: string;
  /**实体信息 */
  refEntity?: TEntity;
  idRefEntity?: string;
} & TAudit;
