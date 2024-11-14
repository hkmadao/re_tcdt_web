export const moduleName = 'componentDesign';

export const diagramContentDivId = 'diagram_content_full_div';

/**组件类型 */
export enum EnumComponentType {
  Single = 'Single',
  Combination = 'Combination',
  Enum = 'Enum',
}

/**图形元素的主键 */
export enum EnumNodeKey {
  ID_ENTITY = 'idEntity',
  ID_ENUM = 'idEnum',
}

/** 当前点击的东西，用于右边显示不同的字段等*/
export enum EnumConcreteDiagramType {
  EMPTY = 'fgMandatory',
  ENTITY = 'entity',
  OUT_ENTITY = 'outEntity',
  ENUM = 'enum',
  OUT_ENUM = 'outEnum',
  PANEL = 'panel',
  ASSOLINK = 'assoLink',
  ENUMASSOLINK = 'enumAssoLink',
}

/**图形的ui配置 */
export enum EnumNodeUi {
  /**实体 */
  ENTITY_DEFAULT_WIDTH = 200,
  ENTITY_DEFAULT_HEIGHT = 150,
  ENTITY_MIN_WIDTH = 100,
  ENTITY_MIN_HEIGHT = 100,
  ENTITY_MAX_WIDTH = 600,
  ENTITY_MAX_HEIGHT = 300,
  /**外部实体 */
  OUT_ENTITY_DEFAULT_WIDTH = 200,
  OUT_ENTITY_DEFAULT_HEIGHT = 150,
  OUT_ENTITY_MIN_WIDTH = 100,
  OUT_ENTITY_MIN_HEIGHT = 100,
  OUT_ENTITY_MAX_WIDTH = 600,
  OUT_ENTITY_MAX_HEIGHT = 300,
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
  width = 2100,
  height = 2970,
  lWidth = 300,
  rWidth = 300,
  bHeight = 400,
}

/**数据集合类型 */
export enum ENumberType {
  Single = 'Single',
  Array = 'Array',
  List = 'List',
  Page = 'Page',
  Void = 'Void',
}

/**数据类型样式 */
export enum ETypeStyle {
  Base = 'Base',
  Ref = 'Ref',
}

/**方法CURD类型 */
export enum ECURD {
  R = 'R',
  CUD = 'CUD',
}

/**方法发布类型类型 */
export enum EPublishType {
  front = 'front',
  service = 'service',
}
