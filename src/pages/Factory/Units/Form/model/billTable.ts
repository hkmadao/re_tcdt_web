import { EInputType } from '@/pages/Factory/Units/common/model';
import {
  TCommonConfigForm,
  TCommonSelectData,
  TCommonField,
  TCommonTab,
} from './billform-common';

/**控件信息 */
export type TTableBillFormField = {
  inputType?: EInputType | string;
} & TCommonField;

/**标签信息 */
export type TTableBillFormTab = {
  billFormFields?: TTableBillFormField[];
} & TCommonTab;

/**数据交互URI信息 */
export type TTableBillFormUriConf = {
  page: string;
  fetchById: string;
  batchRemove: string;
};

/**表单信息 */
export type TTableBillFormConfigList = {
  uriConf?: TTableBillFormUriConf;
  /**表头的标签页信息 */
  header?: TTableBillFormTab[];
  /**表体的标签页信息 */
  body?: TTableBillFormTab[];
  /**表尾的标签页信息 */
  tail?: TTableBillFormTab[];
} & TCommonConfigForm;

/**列表选中数据 */
export type TSelectTableBillFormData = {
  data: TTableBillFormTab | TTableBillFormField;
} & TCommonSelectData;