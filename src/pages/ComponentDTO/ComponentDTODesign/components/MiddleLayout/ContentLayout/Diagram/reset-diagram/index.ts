import createEngine, {
  DiagramModel,
  DiagramEngine,
} from '@projectstorm/react-diagrams';
import { MdPortFactory } from '../Port/MdPortFactory';
import { MdNodeFactory } from '../Node/MdNodeFactory';

import { MdLinkFactory } from '../Link/MdLinkFactory';
import { MdLabelFactory } from '../Label/MdLabelFactory';
import {
  TConcreteDiagram,
  TDtoEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { EnumConcreteDiagramType } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { MdModelType } from '../const';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdLinkModel } from '../Link/MdLinkModel';
import { addEntityNodes, addEnumNodes, associateElements } from '../common';

/**重置图表 */
export default function resetDiagramEngine(
  engine: DiagramEngine,
  entityCollection: TDtoEntityCollection,
  selectLines: TConcreteDiagram[],
  selectNodes: TConcreteDiagram[],
  fgFocus: boolean,
  zoomLevel: number,
  fgShowSysRefAsso: boolean,
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

  const selectLineKeys = selectLines.map((line) => line.idElement);
  const selectNodeKeys = selectNodes.map((selectNode) => selectNode.idElement);

  const {
    dtoNodeUis: nodeUis,
    deAssociates: entityAssociates,
    dtoEnumAssociates: enumAssociates,
    dtoEntities: addEntities,
    dtoEnums: addEnums,
  } = entityCollection;
  // 获取model
  const model: DiagramModel = engine.getModel();

  const mdNodeModels = model.getNodes() as MdNodeModel<TConcreteDiagram>[];
  const mdLinkModels = model.getLinks() as MdLinkModel<TConcreteDiagram>[];
  mdLinkModels.forEach((link) => model.removeLink(link));
  mdNodeModels.forEach((node) => model.removeNode(node));

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
      fgFocus,
      fgShowSysRefAsso,
    );
  }

  model.addAll(...addNodes, ...addLinks);
  // engine.setModel(model);
  engine.repaintCanvas();
  engine.getModel().setZoomLevel(zoomLevel);
  engine.getModel().setOffset(0, 0);
}
