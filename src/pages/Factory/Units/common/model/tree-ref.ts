/**左树配置 */
export type TBillTreeRef = {
  idBillTreeRef: string;
  /**加载树uri */
  uri: string;
  /**http方式 */
  method: 'POST' | 'GET';
  /**参数 */
  methodParams?: any;
  /**树主属性 */
  keyAttr?: string;
  /**树显示属性 */
  labelAttr?: string;
  /**上级Id属性 */
  parentIdAttr?: string;
  // /**树被引用属性 */
  // treeRefAttr: string;
  // /**表格引用属性 */
  // refAttr: string;
  /**关联组件实体id */
  idComponentEntity?: string;
  /**关联实体显示名称 */
  ceDisplayName?: string;
};
