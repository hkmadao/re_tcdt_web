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
  TComponent,
} from '@/pages/ComponentData/ComponentDesign/models';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
import { MdModelType } from '../const';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdLinkModel } from '../Link/MdLinkModel';
import {
  addEntityNodes,
  addEnumNodes,
  addOutEntityNodes,
  addOutEnumNodes,
  associateElements,
} from '../common';

/**重置图表 */
export default function resetDiagramEngine(
  engine: DiagramEngine,
  component: TComponent,
  selectLines: TConcreteDiagram[],
  selectNodes: TConcreteDiagram[],
  fgShowOutEntities: boolean,
  fgShowSysInterfaces: boolean,
  fgFocus: boolean,
  zoomLevel: number,
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
    componentNodeUis,
    componentEntities,
    componentEnums,
    componentEntityAssociates,
    enumAssociates,
    outEntities: addOutEntities,
    outEnums: addOutEnums,
  } = component;
  // 获取model
  const model: DiagramModel = engine.getModel();

  const mdNodeModels = model.getNodes() as MdNodeModel<TConcreteDiagram>[];
  const mdLinkModels = model.getLinks() as MdLinkModel<TConcreteDiagram>[];
  mdLinkModels.forEach((link) => model.removeLink(link));
  mdNodeModels.forEach((node) => model.removeNode(node));

  const addNodes: MdNodeModel<TConcreteDiagram>[] = [];
  const addLinks: MdLinkModel<TConcreteDiagram>[] = [];
  if (componentEntities) {
    addEntityNodes(
      EnumConcreteDiagramType.ENTITY,
      componentEntities,
      mdNodeFactory,
      mdPortFactory,
      componentNodeUis || [],
      selectNodeKeys,
      addNodes,
    );
    if (fgFocus || fgShowOutEntities) {
      addOutEntityNodes(
        EnumConcreteDiagramType.OUT_ENTITY,
        addOutEntities || [],
        mdNodeFactory,
        mdPortFactory,
        componentNodeUis || [],
        selectNodeKeys,
        addNodes,
      );
    }

    addEnumNodes(
      EnumConcreteDiagramType.ENUM,
      componentEnums || [],
      mdNodeFactory,
      mdPortFactory,
      componentNodeUis || [],
      selectNodeKeys,
      addNodes,
    );
    if (fgFocus || fgShowOutEntities) {
      addOutEnumNodes(
        EnumConcreteDiagramType.OUT_ENUM,
        addOutEnums || [],
        mdNodeFactory,
        mdPortFactory,
        componentNodeUis || [],
        selectNodeKeys,
        addNodes,
      );
    }

    const oldNodes = model.getNodes() as MdNodeModel<TConcreteDiagram>[];
    const allNodes = oldNodes.concat(addNodes);
    associateElements(
      componentEntities,
      componentEnums || [],
      componentEntityAssociates || [],
      allNodes,
      fgShowOutEntities,
      mdLinkFactory,
      selectLineKeys,
      addLinks,
      enumAssociates || [],
      fgFocus,
    );
  }

  model.addAll(...addNodes, ...addLinks);
  // engine.setModel(model);
  engine.repaintCanvas();
  engine.getModel().setZoomLevel(zoomLevel);
  engine.getModel().setOffset(0, 0);
}
