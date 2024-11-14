import { TTree } from '@/models';
import { TMenu } from '../../../../models';
export type TFormStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /**页面配置id */
  idUiConf?: string;
  /**组件是否是禁用状态 */
  fgDisabled: boolean;
  editStatusInfo?: {
    id: string;
    editStatus:
      | 'toAdd'
      | 'added'
      | 'toEdit'
      | 'edited'
      | 'reflesh'
      | 'addItem'
      | 'removeItem';
  };
  /**树选中节点 */
  treeSelectedNode?: TTree;
  /**列表页选中的记录 */
  selectedRow?: TMenu;
  /**添加成功的记录 */
  newDataArr: TMenu[];
  /**编辑成功的记录 */
  editData?: TMenu;
  /**编辑表单数据 */
  formData: TMenu;
};
