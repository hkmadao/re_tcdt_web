/**属性类型 */
export type TAttributeType = {
  /**属性类型id */
  idDataType: string;
  /**属性类型名称 */
  code: string;
  /**属性类型显示名称 */
  displayName: string;
  /** 备注 */
  note?: string;
  /** 属性分类 */
  category?: string;
  /** 字段类型 */
  columnType?: string;
  /** java类型 */
  objectType?: string;
  /** 类型所在包 */
  objectTypePackage?: string;
};
