export const moduleName = 'componentTree';

/**树节点类型 */
export enum EnumTreeNodeType {
  ROOT = 'root',
  /**项目 */
  PROJECT = 'project',
  /**子项目 */
  SUB_PROJECT = 'subProject',
  /**组件模块 */
  COMPONENT_MODULE = 'componentModule',
  /**组件集 */
  COMPONENT_ENTITY_COLLECTION = 'componentEntityCollection',
  /**组件操作集 */
  COMPONENT_EO_COLLECTION = 'componentEoCollection',
  ENTITY_LEVEL = 'componentEntity',
  ENUM_LEVEL = 'componentEnum',
}
