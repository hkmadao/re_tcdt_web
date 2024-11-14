export const moduleName = 'descriptTree';

/**树节点类型 */
export enum EnumTreeNodeType {
  ROOT = 'root',
  /**项目 */
  PROJECT = 'project',
  /**子项目 */
  SUB_PROJECT = 'subProject',
  /**实体集 */
  ENTITY_COLLECTION = 'entityCollection',
  /**字典实体集 */
  SD_COLLECTION = 'sdCollection',
  /**实体层 */
  ENTITY_LEVEL = 'entity',
  /**枚举层 */
  ENUM_LEVEL = 'enum',
}
