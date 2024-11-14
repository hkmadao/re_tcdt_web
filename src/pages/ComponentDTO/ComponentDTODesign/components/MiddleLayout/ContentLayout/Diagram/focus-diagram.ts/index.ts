import createEngine, {
  DiagramModel,
  DefaultDiagramState,
  DiagramListener,
  DiagramEngine,
} from '@projectstorm/react-diagrams';
import {
  CanvasWidget,
  CanvasEngineListener,
} from '@projectstorm/react-canvas-core';
import { MdPortFactory } from '../Port/MdPortFactory';
import { MdNodeFactory } from '../Node/MdNodeFactory';

import { MdLinkFactory } from '../Link/MdLinkFactory';
import { MdLabelFactory } from '../Label/MdLabelFactory';
import {
  TConcreteDiagram,
  TDtoEntityCollection,
  TDtoNodeUi,
  TModuleUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { EnumConcreteDiagramType } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { MdModelType, PortModelType } from '../const';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdLinkModel } from '../Link/MdLinkModel';
import findAdd from './find-add-nodtes';
import { addEntityNodes, addEnumNodes, associateElements } from '../common';

/**更新图表元素 */
export default function focusDiagramEngine(
  engine: DiagramEngine,
  entityCollection: TDtoEntityCollection,
  selectLines: TConcreteDiagram[],
  selectNodes: TConcreteDiagram[],
  focusIds: string[],
  moduleUi: TModuleUi,
  nodeUis: TDtoNodeUi[],
) {
  drawGraph(engine, entityCollection, selectLines, selectNodes, focusIds);

  if (selectNodes.length > 1) {
    fitMultipleGraph(engine, moduleUi, nodeUis);
    return;
  }
  if (selectNodes.length < 1) {
    return;
  }

  fitSingleGraph(
    engine,
    entityCollection,
    selectLines,
    selectNodes,
    focusIds,
    moduleUi,
    nodeUis,
  );
}

export function fitMultipleGraph(
  engine: DiagramEngine,
  moduleUi: TModuleUi,
  nodeUis: TDtoNodeUi[],
) {
  const nodes = engine.getModel().getNodes();
  let minX: number = 0;
  let maxX: number = 0;
  let minY: number = 0;
  let maxY: number = 0;
  if (nodes.length === 0) {
    engine.getModel().setOffset(moduleUi.lWidth, moduleUi.hHeight);
    engine.getModel().setZoomLevel(100);
    return;
  }
  if (nodes.length === 1) {
    const idElement = (nodes[0] as MdNodeModel<TConcreteDiagram>).getExtras()
      .idElement;
    const findNodeUi = nodeUis?.find(
      (nodeUi) => nodeUi.idElement === idElement,
    );
    if (!findNodeUi) {
      console.error('找不到元素ui信息！');
      return;
    }
    minX = findNodeUi.x!;
    minY = findNodeUi.y!;
    maxX = findNodeUi.x! + findNodeUi.width!;
    maxY = findNodeUi.y! + findNodeUi.height!;
  } else {
    nodes.forEach((node, index) => {
      const idElement = (node as MdNodeModel<TConcreteDiagram>).getExtras()
        .idElement;
      const findNodeUi = nodeUis?.find(
        (nodeUi) => nodeUi.idElement === idElement,
      );
      if (!findNodeUi) {
        console.error('找不到元素ui信息！');
        return;
      }
      if (index === 0) {
        minX = findNodeUi.x!;
        maxX = findNodeUi.x! + findNodeUi.width!;
        minY = findNodeUi.y!;
        maxY = findNodeUi.y! + findNodeUi.height!;
        return;
      }
      if (findNodeUi.x! < minX) {
        minX = findNodeUi.x!;
      }
      if (findNodeUi.x! + findNodeUi.width! > maxX) {
        maxX = findNodeUi.x! + findNodeUi.width!;
      }
      if (findNodeUi.y! < minY) {
        minY = findNodeUi.y!;
      }
      if (findNodeUi.y! + findNodeUi.height! > maxY) {
        maxY = findNodeUi.y! + findNodeUi.height!;
      }
    });
  }
  const cWidth = moduleUi.cWidth;
  const cHeight = moduleUi.cHeight;
  const viewWidth = cWidth - moduleUi.lWidth - moduleUi.rWidth;
  const viewHeight = cHeight - moduleUi.hHeight - moduleUi.bHeight;
  //计算比例
  const widthScale = viewWidth / Math.abs(maxX - minX);
  const heightScale = viewHeight / Math.abs(maxY - minY);
  let viewScale = widthScale;
  if (heightScale < widthScale) {
    viewScale = heightScale;
  }
  if (viewScale > 1.2) {
    viewScale = 1.2;
  }
  if (viewScale < 0.1) {
    viewScale = 0.1;
  }
  /**
   * 图形向左偏移为- 向右偏移为+
   * 图形向上偏移为- 向下偏移为+
   */
  /**缩放后聚焦区域中心点对齐视窗中心点 */
  const offsetX =
    (maxX + minX) / 2 -
    (moduleUi.lWidth + (cWidth - moduleUi.lWidth - moduleUi.rWidth) / 2) /
      viewScale;
  const offsetY =
    (maxY + minY) / 2 -
    (moduleUi.hHeight + (cHeight - moduleUi.hHeight - moduleUi.bHeight) / 2) /
      viewScale;

  /**=============================== */
  let scaleOffsetX = offsetX * viewScale;
  let scaleOffsetY = offsetY * viewScale;
  engine.getModel().setOffset(0, 0);
  const zoomLevel = viewScale * 100;
  engine.getModel().setZoomLevel(zoomLevel);
  engine.getModel().setOffset(-scaleOffsetX, -scaleOffsetY);
  /**=============================== */
}

function fitSingleGraph(
  engine: DiagramEngine,
  entityCollection: TDtoEntityCollection,
  selectLines: TConcreteDiagram[],
  selectNodes: TConcreteDiagram[],
  focusIds: string[],
  moduleUi: TModuleUi,
  nodeUis: TDtoNodeUi[],
) {
  const nodes = engine.getModel().getNodes();
  const idElement = selectNodes[0].idElement;
  const findNodeUi = nodeUis?.find((nodeUi) => nodeUi.idElement === idElement);
  if (!findNodeUi) {
    console.error('找不到元素ui信息！');
    return;
  }
  const minX = findNodeUi.x!;
  const minY = findNodeUi.y!;
  const maxX = findNodeUi.x! + findNodeUi.width!;
  const maxY = findNodeUi.y! + findNodeUi.height!;
  const cWidth = moduleUi.cWidth;
  const cHeight = moduleUi.cHeight;
  const viewWidth = cWidth - moduleUi.lWidth - moduleUi.rWidth;
  const viewHeight = cHeight - moduleUi.hHeight - moduleUi.bHeight;
  //计算比例
  const widthScale = viewWidth / Math.abs(maxX - minX);
  const heightScale = viewHeight / Math.abs(maxY - minY);
  let viewScale = widthScale;
  if (heightScale < widthScale) {
    viewScale = heightScale;
  }
  if (viewScale > 1.2) {
    viewScale = 1.2;
  }
  if (viewScale < 0.1) {
    viewScale = 0.1;
  }
  /**
   * 图形向左偏移为- 向右偏移为+
   * 图形向上偏移为- 向下偏移为+
   */
  /**缩放后聚焦区域中心点对齐视窗中心点 */
  const offsetX =
    (maxX + minX) / 2 -
    (moduleUi.lWidth + (cWidth - moduleUi.lWidth - moduleUi.rWidth) / 2) /
      viewScale;
  const offsetY =
    (maxY + minY) / 2 -
    (moduleUi.hHeight + (cHeight - moduleUi.hHeight - moduleUi.bHeight) / 2) /
      viewScale;

  /**=============================== */
  let scaleOffsetX = offsetX * viewScale;
  let scaleOffsetY = offsetY * viewScale;
  engine.getModel().setOffset(0, 0);
  const zoomLevel = viewScale * 100;
  engine.getModel().setZoomLevel(zoomLevel);
  engine.getModel().setOffset(-scaleOffsetX, -scaleOffsetY);
  /**=============================== */
}

function drawGraph(
  engine: DiagramEngine,
  entityCollection: TDtoEntityCollection,
  selectLines: TConcreteDiagram[],
  selectNodes: TConcreteDiagram[],
  focusIds: string[],
) {
  const mdNodeFactory = engine
    .getNodeFactories()
    .getFactory(
      MdModelType.MDNODE,
    ) as unknown as MdNodeFactory<TConcreteDiagram>;
  const mdPortFactory = engine
    .getPortFactories()
    .getFactory(MdModelType.MDPORT) as unknown as MdPortFactory;
  const mdLinkFactory = engine
    .getLinkFactories()
    .getFactory(
      MdModelType.MDLINK,
    ) as unknown as MdLinkFactory<TConcreteDiagram>;
  const mdLabelFactory = engine
    .getLabelFactories()
    .getFactory(MdModelType.MDLABEL) as unknown as MdLabelFactory;

  const {
    deAssociates: entityAssociates,
    dtoEnumAssociates: enumAssociates,
    dtoNodeUis: nodeUis,
  } = entityCollection;

  const selectLineKeys = selectLines.map((line) => line.idElement);
  const selectNodeKeys = selectNodes.map((selectNode) => selectNode.idElement);

  // const { mdPortFactory, mdNodeFactory, mdLinkFactory, mdLabelFactory } =
  //   factorys;
  // const {
  //   entities,
  //   outEntities,
  //   entityAssos,
  //   enums,
  //   outEnums,
  //   enumAssos,
  //   nodeUis,
  //   interfaces,
  //   outInterfaces,
  //   sysInterfaces,
  //   implementAssos,
  // } = data;
  // engine.deregisterListener()
  // 获取model
  const model: DiagramModel = engine.getModel();
  // const modelListener: DiagramListener = {
  //   lockChanged: (event: any) => {
  //     // console.log(event)
  //   },
  //   nodesUpdated: (event: any) => {
  //     console.log(event)
  //   },
  //   linksUpdated: (event: any) => {
  //     // console.log(event)
  //   }
  // };
  // model.clearListeners();
  // model.registerListener(modelListener);
  //清理旧数据
  // model.getLinks().forEach((link) => model.removeLink(link));
  // model.getNodes().forEach((node) => model.removeNode(node));
  const mdNodeModels = model.getNodes() as MdNodeModel<TConcreteDiagram>[];
  const mdLinkModels = model.getLinks() as MdLinkModel<TConcreteDiagram>[];
  mdLinkModels.forEach((link) => model.removeLink(link));
  mdNodeModels.forEach((node) => model.removeNode(node));

  const addElements = findAdd(entityCollection, focusIds);
  const { addEntities, addEnums } = addElements!;

  const addNodes: MdNodeModel<TConcreteDiagram>[] = [];
  const addLinks: MdLinkModel<TConcreteDiagram>[] = [];
  if (addEntities) {
    addEntityNodes(
      EnumConcreteDiagramType.ENTITY,
      addEntities,
      mdNodeFactory,
      mdPortFactory,
      nodeUis,
      selectNodeKeys,
      addNodes,
    );

    addEnumNodes(
      EnumConcreteDiagramType.ENUM,
      addEnums,
      mdNodeFactory,
      mdPortFactory,
      nodeUis,
      selectNodeKeys,
      addNodes,
    );

    const oldNodes = model.getNodes() as MdNodeModel<TConcreteDiagram>[];
    const allNodes = oldNodes.concat(addNodes);
    associateElements(
      entityAssociates,
      allNodes,
      mdLinkFactory,
      selectLineKeys,
      addLinks,
      enumAssociates,
      true,
    );
  }

  model.addAll(...addNodes, ...addLinks);
  // engine.setModel(model);
  engine.repaintCanvas();
}
