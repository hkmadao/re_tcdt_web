import { EnumConcreteDiagramType, EnumSystemType } from '../conf';
import { TEntity } from './ddEntity';
import { TEnum } from './ddEnum';
import { TEntityAssociate } from './entityAssociate';
import { TEntityCollection } from './entityCollection';

export * from './ddEntity';
export * from './ddEnum';
export * from './dataType';
export * from './commAttr';
export * from './entityAssociate';
export * from './enumAssociate';
export * from './nodeUi';
export * from './entityCollection';
export * from './project';

/**
 * 图表border的ui信息
 */
export type TModuleUi = {
  /**图表区域宽度 */
  cWidth: number;
  /**图表区域高度 */
  cHeight: number;
  /**头部面板高度 */
  hHeight: number;
  /**L左侧面板宽度 */
  lWidth: number;
  /**右侧面板宽度 */
  rWidth: number;
  /**底部面板高度 */
  bHeight: number;
  /**跳转元素的id */
  goToId?: string;
  /**图表的缩放比例 */
  zoomLevel: number;
};

/**
 * 图表ui信息
 */
export type TDiagramUi = {
  /**鼠标在图形区域的x坐标 */
  mouseX: number;
  /**鼠标在图形区域的y坐标 */
  mouseY: number;
  /**图表偏移x轴距离 */
  offsetX: number;
  /**图表偏移y轴距离 */
  offsetY: number;
};

export type TModuleStore = {
  /**图表border的ui信息 */
  moduleUi: TModuleUi;
  /**图表content的ui */
  diagramUi: TDiagramUi;
  fgInit: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  idProject?: string;
  // tree: TTree;
  addElementStatus?: 'entity' | 'enum';
  /**进入连线模式 */
  connectionMode?: boolean;
  /**实体集的数据 */
  entityCollection: TEntityCollection;
  /**是否显示外部实体 */
  fgShowOutEntities: boolean;
  /**是否显示枚举连线 */
  fgShowEnumAsso: boolean;
  /**画布重绘次数 */
  drawCount: number;
  /**单个选中的元素 */
  currentSelect: TConcreteDiagram;
  /**选中的节点 */
  selectNodes?: TConcreteDiagram[];
  /**选中的连线 */
  selectLines?: TConcreteDiagram[];
  /**关注数据id集合 */
  focusIds: string[];
  /**关注状态下画布重绘次数 */
  focusDrawCount: number;
  /**适合画布操作次数 */
  zoomToFitCount: number;
};

/**图表元素内容 */
export type TDiagramContent =
  | TEntity
  | TMdInterface
  | TEnum
  | TPanel
  | TEntityAssociate;

/**具体的图表元素 */
export type TConcreteDiagram = {
  /**具体的元素类型 */
  concreteType: EnumConcreteDiagramType;
  /**具体元素内容 */
  idElement?: string;
};

/**接口 */
export type TMdInterface = {
  idMdInterface: string;
};

/**面板 */
export type TPanel = {
  idPanel: string;
};