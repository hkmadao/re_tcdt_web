import createEngine, {
  DiagramModel,
  DefaultDiagramState,
  DiagramListener,
} from '@projectstorm/react-diagrams';
import {
  CanvasWidget,
  CanvasEngineListener,
} from '@projectstorm/react-canvas-core';
import { MdPortFactory } from './Port/MdPortFactory';
import { MdNodeFactory } from './Node/MdNodeFactory';

import { MdLinkFactory } from './Link/MdLinkFactory';
import { MdLabelFactory } from './Label/MdLabelFactory';
import {
  TConcreteDiagram,
  TDiagramContent,
  TEntity,
} from '@/pages/DescriptData/DescriptDesign/models';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import { PortModelType } from './const';

/** 输出engine用于渲染
 * */
export default function createDiagramEngine(factorys: {
  mdPortFactory: MdPortFactory;
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>;
  mdLinkFactory: MdLinkFactory<TConcreteDiagram>;
  mdLabelFactory: MdLabelFactory;
}) {
  const { mdPortFactory, mdNodeFactory, mdLinkFactory, mdLabelFactory } =
    factorys;
  // 创建engine
  const engine = createEngine({ registerDefaultDeleteItemsAction: false });
  const eListener: CanvasEngineListener = {
    rendered: () => {},
  };
  //注册事件
  engine.registerListener(eListener);
  // 创建model
  const model = new DiagramModel();
  const modelListener: DiagramListener = {
    lockChanged: (event: any) => {},
    nodesUpdated: (event: any) => {},
    linksUpdated: (event: any) => {},
  };
  //注册事件
  model.registerListener(modelListener);

  const state = engine.getStateMachine().getCurrentState();
  if (state instanceof DefaultDiagramState) {
    state.dragNewLink.config.allowLooseLinks = false;

    // 注册自定义node port link
    engine.getPortFactories().registerFactory(mdPortFactory);
    engine.getNodeFactories().registerFactory(mdNodeFactory);
    engine.getLinkFactories().registerFactory(mdLinkFactory);
    engine.getLabelFactories().registerFactory(mdLabelFactory);

    // const entity: TEntity = {
    //   idEntity: '1',
    //   className: 'xsrrg',
    //   displayName: '然即段',
    //   idEntityCollection: '1',
    //   attributes: [
    //     {
    //       idEntity: '1',
    //       idAttribute: '1',
    //       name: 'dusfmcex',
    //       displayName: '压内些据',
    //     },
    //   ],
    // };
    // const initialConfig: TConcreteDiagram = {
    //   concreteType: EnumConcreteDiagramType.ENTITY,
    //   diagramContent: entity,
    // }

    // const node = mdNodeFactory.generateModel({ initialConfig });
    // node.addPort(
    //   mdPortFactory.generateModel({
    //     initialConfig: { name: PortModelType.SOURCE, idNode: entity.idEntity },
    //   }),
    // );
    // node.addPort(
    //   mdPortFactory.generateModel({
    //     initialConfig: { name: PortModelType.TARGET, idNode: entity.idEntity },
    //   }),
    // );
    // node.setPosition(
    //   50, 50
    // );
    // model.addAll(node)

    // 注入model至engine
    engine.setModel(model);

    return engine;
  }

  return engine;
}
