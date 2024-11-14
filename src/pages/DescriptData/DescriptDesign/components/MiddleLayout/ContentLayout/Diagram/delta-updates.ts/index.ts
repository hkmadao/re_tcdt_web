import createEngine, {
  DiagramModel,
  DefaultDiagramState,
  DiagramListener,
  DiagramEngine,
} from '@projectstorm/react-diagrams';
import { MdPortFactory } from '../Port/MdPortFactory';
import { MdNodeFactory } from '../Node/MdNodeFactory';

import { MdLinkFactory } from '../Link/MdLinkFactory';
import { MdLabelFactory } from '../Label/MdLabelFactory';
import {
  TConcreteDiagram,
  TEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/models';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import { MdModelType } from '../const';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdLinkModel } from '../Link/MdLinkModel';
import findDelete from './find-delete-notes';
import findAdd from './find-add-nodtes';
import { addEntityNodes, addEnumNodes, associateElements } from '../common';

/**更新图表元素 */
export default function deltaUpdatesDiagramEngine(
  engine: DiagramEngine,
  entityCollection: TEntityCollection,
  selectLines: TConcreteDiagram[],
  selectNodes: TConcreteDiagram[],
  fgShowOutEntities: boolean,
  fgShowEnumAsso: boolean,
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

  const { entityAssociates, enumAssociates, nodeUis } = entityCollection;

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
  const deleteElements = findDelete(
    entityCollection,
    { mdNodeModels, mdLinkModels },
    fgShowOutEntities,
    fgShowEnumAsso,
  );
  mdLinkModels.forEach((link) => model.removeLink(link));
  deleteElements.deleteMdNodes.forEach((node) => model.removeNode(node));

  const addElements = findAdd(entityCollection, { mdNodeModels, mdLinkModels });
  const { addEntities, addOutEntities, addEnums, addOutEnums } = addElements;

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
    if (fgShowOutEntities) {
      addEntityNodes(
        EnumConcreteDiagramType.OUT_ENTITY,
        addOutEntities,
        mdNodeFactory,
        mdPortFactory,
        nodeUis,
        selectNodeKeys,
        addNodes,
      );
    }

    addEnumNodes(
      EnumConcreteDiagramType.ENUM,
      addEnums,
      mdNodeFactory,
      mdPortFactory,
      nodeUis,
      selectNodeKeys,
      addNodes,
    );
    if (fgShowOutEntities) {
      addEnumNodes(
        EnumConcreteDiagramType.OUT_ENUM,
        addOutEnums,
        mdNodeFactory,
        mdPortFactory,
        nodeUis,
        selectNodeKeys,
        addNodes,
      );
    }

    const oldNodes = model.getNodes() as MdNodeModel<TConcreteDiagram>[];
    const allNodes = oldNodes.concat(addNodes);
    associateElements(
      entityAssociates,
      allNodes,
      fgShowOutEntities,
      mdLinkFactory,
      selectLineKeys,
      addLinks,
      enumAssociates,
      fgShowEnumAsso,
      false,
    );
  }

  model.addAll(...addNodes, ...addLinks);
  // engine.setModel(model);
  engine.repaintCanvas();
}
