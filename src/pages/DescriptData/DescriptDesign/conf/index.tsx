export const moduleName = 'descriptDesign';

export const diagramContentDivId = 'diagram_content_full_div';

/**系统树类别 */
export enum EnumSystemType {
  /**单系统 */
  SINGLE_SYSTEM = 'singleSystem',
  /**多系统 */
  MULTIPLE_SYSTEM = 'multipleSystem',
}

// /**树级别 */
// export enum EnumTreeLevelType {
//   /**根目录 */
//   ROOT = 'root',
//   /**项目 */
//   PROJECT = 'project',
//   /**子项目 */
//   SUB_PROJECT = 'subProject',
//   /**实体集 */
//   ENTITY_COLLECTION = 'entityCollection',
// }

/** 当前点击的东西，用于右边显示不同的字段等*/
export enum EnumConcreteDiagramType {
  EMPTY = 'empty',
  ENTITY = 'entity',
  OUT_ENTITY = 'outEntity',
  MDDTO = 'mdDto',
  ENUM = 'enum',
  OUT_ENUM = 'outEnum',
  PANEL = 'panel',
  ASSOLINK = 'assoLink',
  ENUMASSOLINK = 'enumAssoLink',
}

/**图形的ui配置 */
export enum EnumNodeUi {
  /**枚举 */
  ENUM_DEFAULT_WIDTH = 200,
  ENUM_DEFAULT_HEIGHT = 150,
  ENUM_MIN_WIDTH = 100,
  ENUM_MIN_HEIGHT = 100,
  ENUM_MAX_WIDTH = 600,
  ENUM_MAX_HEIGHT = 300,
  /**简单显示实体 */
  ENTITY_SIMPLE_DEFAULT_WIDTH = 200,
  ENTITY_SIMPLE_DEFAULT_HEIGHT = 150,
  ENTITY_SIMPLE_MIN_WIDTH = 100,
  ENTITY_SIMPLE_MIN_HEIGHT = 100,
  ENTITY_SIMPLE_MAX_WIDTH = 600,
  ENTITY_SIMPLE_MAX_HEIGHT = 300,
  /**简单显示外部实体 */
  OUT_ENTITY_SIMPLE_DEFAULT_WIDTH = 200,
  OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT = 150,
  OUT_ENTITY_SIMPLE_MIN_WIDTH = 100,
  OUT_ENTITY_SIMPLE_MIN_HEIGHT = 100,
  OUT_ENTITY_SIMPLE_MAX_WIDTH = 600,
  OUT_ENTITY_SIMPLE_MAX_HEIGHT = 300,
}

export enum EnumCanvasUi {
  width = 29700,
  height = 21000,
  lWidth = 300,
  rWidth = 300,
  bHeight = 400,
}

/**父关系类型 */
export enum EnumUpAssociateType {
  /**1 */
  ONE = 'one',
  /**0...1 */
  ZERO_ONE = 'zeroOne',
}

/**子关系类型 */
export enum EnumDownAssociateType {
  /**0...1 */
  ZERO_TO_ONE = 'zeroToOne',
  /**0...N */
  ZERO_TO_MANY = 'zeroToMany',
  /**1...1 */
  ONE_TO_ONE = 'oneToOne',
  /**1...N */
  ONE_TO_MANY = 'oneToMany',
}
