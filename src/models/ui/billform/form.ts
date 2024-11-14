import { TAudit } from '@/models';
import { EFormItemInputType, TBillRef, TValueEnum } from '..';

/**控件信息 */
export type TBillFormField = {
  idBillFormField?: string;
  idBillFormTab?: string;
  showOrder?: number;
  name?: string;
  displayName?: string;
  dataType?: string;
  defaultValue?: string;
  /**是否主键 */
  fgMainProperty?: boolean;
  inputType?: EFormItemInputType;
  /**引用配置 */
  refConfig?: TBillRef;
  /**枚举配置 */
  valueEnums?: TValueEnum[];
  placeholder?: string;
  width?: string;
  fgEllipsis?: boolean;
  ellipsisLen?: number;
  /**引用属性名称 */
  refAttributeName: string;
};

/**标签信息 */
export type TBillFormTab = {
  idBillFormTab?: string;
  idBillForm?: string;
  displayOrder?: string;
  billFormFields?: TBillFormField[];
  tabCode?: string;
  tabIndex?: number;
  tabName?: string;
  mainProperty?: string;
  /**属性数组类型 */
  numberType?: 'Single' | 'Array';
  /**排序属性 */
  orderProperty?: string;
  /**排序类型 */
  orderType?: string;
  /**标签类名 */
  tabClassName?: string;
  /**标签属性名 */
  tabAttrName?: string;
};

/**数据交互URI信息 */
type TUriConf = {
  fetchById: string;
  save: string;
  update: string;
  dataRemove: string;
};

/**表单信息 */
export type TBillFormConfigForm = {
  idBillForm?: string;
  /**所属方案id */
  idComponent?: string;
  name?: string;
  displayName?: string;
  uriConf: TUriConf;
  /**表头的标签页信息 */
  header?: TBillFormTab[];
  /**表体的标签页信息 */
  body?: TBillFormTab[];
  /**表尾的标签页信息 */
  tail?: TBillFormTab[];
} & TAudit;
