export const moduleName = 'componentDTOTree';

/**树节点类型 */
export enum EnumTreeNodeType {
  ROOT = 'root',
  /**项目 */
  PROJECT = 'project',
  /**子项目 */
  SUB_PROJECT = 'subProject',
  /**dto模块 */
  DTO_MODULE = 'dtoModule',
  /**DTO集 */
  DTO_COLLECTION = 'dtoCollection',
  /**组件操作集 */
  SD_COLLECTION = 'sdCollection',
  ENTITY_LEVEL = 'dtoEntity',
  ENUM_LEVEL = 'dtoEnum',
}

/**实体树节点类型 */
export enum EntityEnumTreeNodeType {
  ROOT = 'root',
  /**项目 */
  PROJECT = 'project',
  /**子项目 */
  SUB_PROJECT = 'subProject',
  /**组件集 */
  ENTITY_COLLECTION = 'entityCollection',
  /**组件操作集 */
  SD_COLLECTION = 'sdCollection',
}
