/**枚举配置 */
export type TEnumRef = {
  idEnumRef: string;
  /**输入框label */
  label?: string;
  /**输入框属性 */
  propertyName?: string;
  /**enum弹出框标题 */
  title?: string;
  /**enum表格列配置 */
  enumColumns?: TEnumColumn[];
  /**关联组件枚举id */
  idComponentEnum?: string;
  /**关联枚举显示名称 */
  ceDisplayName?: string;
};

/**枚举字段配置 */
export type TEnumColumn = {
  idEnumColumn: string;
  /**枚举编码 */
  code?: string;
  /**枚举值 */
  enumValue?: string;
  /**枚举显示名称 */
  displayName?: string;
};
