import { TBillRef, TEnumRef } from '@/models';

/**控件信息 */
export type TCommonField = {
  idBillFormField?: string;
  idBillFormTab?: string;
  /**显示顺序 */
  showOrder?: number;
  /**名称 */
  name?: string;
  /**显示名称 */
  displayName?: string;
  /**默认值 */
  defaultValue?: string;
  /**是否主键 */
  fgMainProperty?: boolean;
  /**输入框类型，用来给前端区分 */
  inputType?: string;
  /**引用配置 */
  refConfig?: TBillRef;
  /**枚举配置 */
  enumConfig?: TEnumRef;
  /**是否树节点属性 */
  fgTreeAttr?: boolean;
  /**引用属性名称 */
  refAttributeName?: string;
  /**是否显示标志 */
  fgDisplay?: boolean;
  /**前端TypeScript数据类型，未使用 */
  typeScriptType?: string;
  dataType?: string;
  /**宽度 */
  width?: number;
  /**超过文本长度部分使用'...'显示 */
  textLen?: number;
};

export type TOrderInfo = {
  idOrderInfo: string;
  /**排序属性 */
  orderProperty?: string;
  /**排序类型 */
  orderType?: 'ASC' | 'DESC';
};

/**标签信息 */
export type TCommonTab = {
  idBillFormTab?: string;
  idBillForm?: string;
  billFormFields?: TCommonField[];
  /**显示顺序 */
  tabIndex?: number;
  /**标签名称 */
  tabName?: string;
  /**标签编码 */
  tabCode?: string;
  /**第一个字母大写标签编码 */
  firstUpperTabCode?: string;
  /**是否默认页签 */
  fgDefaultTab?: boolean;
  /**主属性名称 */
  mainProperty?: string;
  /**引用类型：Ref：多对1引用，SingleRef：1对1引用，Array：1对多引用，Single：1对1引用 */
  refType?: 'Ref' | 'SingleRef' | 'Single' | 'Array';
  orderInfoList: TOrderInfo[];
  /**标签类名，使用typescript时需要用的类名称 */
  tabClassName?: string;
  /**元数据属性名，用做回显，和实际使用无关 */
  metadataAttrName?: string;
  entityTypeName?: string;
  /**第一个字母小写标签类名 */
  firstLowerTabClassName?: string;
  /**标签属性名 */
  tabAttrName?: string;
  /**第一个字母大写标签属性名 */
  firstUpperTabAttrName?: string;
};

/**表单信息 */
export type TCommonConfigForm = {
  idBillForm?: string;
  /**所属方案id */
  idComponent?: string;
  name?: string;
  displayName?: string;
  /**主类名 */
  mainClass: string;
  /**主属性名 */
  mainProperty: string;
  // /**表头的标签页信息 */
  // header?: TCommonTab[];
  // /**表体的标签页信息 */
  // body?: TCommonTab[];
  // /**表尾的标签页信息 */
  // tail?: TCommonTab[];
};
