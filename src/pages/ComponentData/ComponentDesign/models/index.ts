import { EnumConcreteDiagramType } from '../conf';
import { TEntity } from './ddEntity';
import { TEnum } from './ddEnum';
import { TEntityAssociate } from './entityAssociate';
import { TComponent } from './component';

export * from './ddEntity';
export * from './componentEntity';
export * from './componentEnum';
export * from './ddEnum';
export * from './dataType';
export * from './entityAssociate';
export * from './enumAssociate';
export * from './nodeUi';
export * from './entityCollection';
export * from './component';
export * from './componentMethod';

/**
 * 模块ui信息
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
  /**鼠标在图形区域的x坐标,每次使用后清零 */
  mouseX: number;
  /**鼠标在图形区域的y坐标,每次使用后清零 */
  mouseY: number;
  /**图表偏移x轴距离 */
  offsetX: number;
  /**图表偏移y轴距离 */
  offsetY: number;
  /**图表的缩放比例 */
  zoomLevel: number;
  /**跳转元素的id */
  goToId?: string;
};

export type TModuleStore = {
  /**子项目ui信息 */
  moduleUi: TModuleUi;
  fgInit: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  idProject?: string;
  /**实体集的数据 */
  component: TComponent;
  /**是否显示外部实体 */
  fgShowOutEntities: boolean;
  /**是否显示系统接口 */
  fgShowSysInterfaces: boolean;
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
