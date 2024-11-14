import { TAudit, TValueEnum } from '@/models';

/**控件信息 */
export type TTableBillFormField = {
  idBillFormField?: string;
  idBillFormTab?: string;
  showOrder?: number;
  name?: string;
  displayName?: string;
  dataType?: string;
  defaultValue?: string;
  /**是否主键 */
  fgMainProperty?: boolean;
  inputType?: any;
  /**枚举配置 */
  valueEnums?: TValueEnum[];
  width?: number;
  fgEllipsis?: boolean;
  ellipsisLen?: number;
  /**引用属性名称 */
  refAttributeName: string;
};

/**标签信息 */
export type TTableBillFormTab = {
  idBillFormTab?: string;
  idBillForm?: string;
  billFormFields?: TTableBillFormField[];
  displayOrder?: string;
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
  rowMenuConfig?: {
    rowMeumItems?: string[];
  };
  /**标签类名 */
  tabClassName?: string;
  /**标签属性名 */
  tabAttrName?: string;
};

/**数据交互URI信息 */
type TUriConf = {
  page: string;
  fetchById: string;
  batchRemove: string;
};

/**表单信息 */
export type TTableBillFormConfigList = {
  idBillForm?: string;
  /**所属方案id */
  idComponent?: string;
  name?: string;
  displayName?: string;
  uriConf: TUriConf;
  /**表头的标签页信息 */
  header?: TTableBillFormTab[];
  /**表体的标签页信息 */
  body?: TTableBillFormTab[];
  /**表尾的标签页信息 */
  tail?: TTableBillFormTab[];
} & TAudit;
