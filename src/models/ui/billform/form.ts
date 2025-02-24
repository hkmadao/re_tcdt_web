import { EInputType } from '..';
import { TCommonConfigForm, TCommonField, TCommonTab } from '.';

/**控件信息 */
export type TBillFormField = {
  placeholder?: string;
  inputType?: EInputType | string;
  /**只读属性 */
  readonly?: boolean;
} & TCommonField;

/**标签信息 */
export type TBillFormTab = {
  billFormFields?: TBillFormField[];
} & TCommonTab;

/**表单信息 */
export type TBillFormConfigForm = {
  uriConf?: TBillFormUriConf;
  /**表头的标签页信息 */
  header?: TBillFormTab[];
  /**表体的标签页信息 */
  body?: TBillFormTab[];
  /**表尾的标签页信息 */
  tail?: TBillFormTab[];
} & TCommonConfigForm;

/**数据交互URI信息 */
export type TBillFormUriConf = {
  fetchById: string;
  save: string;
  update: string;
  dataRemove: string;
};
