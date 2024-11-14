import { nanoid } from '@reduxjs/toolkit';
import { EActiveKey, TModuleStore } from '../model';

export const getInitialState = () => {
  const firstTreeRefId = nanoid();
  const thirdTreeRefId = nanoid();
  const initialState: TModuleStore = {
    status: 'idle',
    data: {
      twoLevelStatus: false,
      /**树节点可搜索属性 */
      searchAttrs: [],
      firstTreeRef: {
        idBillTreeRef: firstTreeRefId,
        /**加载树uri */
        uri: '',
        /**http方式 */
        method: 'POST',
        /**参数 */
        methodParams: undefined,
        /**树主属性 */
        keyAttr: '',
        /**树显示属性 */
        labelAttr: '',
        /**上级Id属性 */
        parentIdAttr: '',
      },
      thirdTreeRef: {
        idBillTreeRef: thirdTreeRefId,
        /**加载树uri */
        uri: '',
        /**http方式 */
        method: 'POST',
        /**参数 */
        methodParams: undefined,
        /**树主属性 */
        keyAttr: '',
        /**树显示属性 */
        labelAttr: '',
        /**上级Id属性 */
        parentIdAttr: '',
      },
    },
    activeKey: EActiveKey.firstTreeRef,
  };
  return initialState;
};

export const initialState: TModuleStore = getInitialState();
