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
  TDiagramContent,
  TEntity,
  TEntityAssociate,
  TEnum,
  TEnumAssociate,
  TComponentNodeUi,
  TComponentEntity,
  TComponentEntityAssociate,
  TComponentEnum,
} from '@/pages/ComponentData/ComponentDesign/models';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdPortModel } from '../Port/MdPortModel';
import { MdLinkModel } from '../Link/MdLinkModel';

export function addEnumNodes(
  concreteType: EnumConcreteDiagramType,
  addComponentEnums: TComponentEnum[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TComponentNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {
  addComponentEnums?.forEach((componentEnum) => {
    if (componentEnum.action === DOStatus.DELETED) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType,
      idElement: componentEnum.idComponentEnum,
    };
    const node = mdNodeFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.SOURCE,
          idElement: componentEnum.idComponentEnum,
          concreteType,
        },
      }),
    );
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.TARGET,
          idElement: componentEnum.idComponentEnum,
          concreteType,
        },
      }),
    );
    const nodeUi = nodeUis?.find(
      (nodeUi) =>
        nodeUi.idElement === componentEnum.idComponentEnum &&
        nodeUi.action !== DOStatus.DELETED,
    );
    node.setPosition(nodeUi?.x as number, nodeUi?.y as number);
    if (selectNodeKeys.includes(componentEnum.idComponentEnum)) {
      node.setSelected(true);
    }
    addNodes.push(node);
  });
}

export function addOutEnumNodes(
  concreteType: EnumConcreteDiagramType,
  addOutEnums: TEnum[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TComponentNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {}

export function addEntityNodes(
  concreteType: EnumConcreteDiagramType,
  addEntities: TComponentEntity[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TComponentNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {
  addEntities?.forEach((entity) => {
    if (entity.action === DOStatus.DELETED) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType,
      idElement: entity.idComponentEntity,
    };
    const node = mdNodeFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.SOURCE,
          idElement: entity.idComponentEntity,
          concreteType,
        },
      }),
    );
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.TARGET,
          idElement: entity.idComponentEntity,
          concreteType,
        },
      }),
    );
    const nodeUi = nodeUis?.find(
      (nodeUi) =>
        nodeUi.idElement === entity.idComponentEntity &&
        nodeUi.action !== DOStatus.DELETED,
    );
    node.setPosition(nodeUi?.x as number, nodeUi?.y as number);
    if (selectNodeKeys.includes(entity.idComponentEntity)) {
      node.setSelected(true);
    }
    addNodes.push(node);
  });
}

export function addOutEntityNodes(
  concreteType: EnumConcreteDiagramType,
  addEntities: TEntity[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TComponentNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {
  addEntities?.forEach((entity) => {
    if (entity.action === DOStatus.DELETED) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType,
      idElement: entity.idEntity,
    };
    const node = mdNodeFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.SOURCE,
          idElement: entity.idEntity,
          concreteType,
        },
      }),
    );
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.TARGET,
          idElement: entity.idEntity,
          concreteType,
        },
      }),
    );
    const nodeUi = nodeUis?.find(
      (nodeUi) =>
        nodeUi.idElement === entity.idEntity &&
        nodeUi.action !== DOStatus.DELETED,
    );
    node.setPosition(nodeUi?.x as number, nodeUi?.y as number);
    if (selectNodeKeys.includes(entity.idEntity)) {
      node.setSelected(true);
    }
    addNodes.push(node);
  });
}

export function associateElements(
  componentEntities: TComponentEntity[],
  componentEnums: TComponentEnum[],
  entityAssos: TComponentEntityAssociate[],
  allNodes: MdNodeModel<TConcreteDiagram>[],
  fgShowOutEntities: boolean,
  mdLinkFactory: MdLinkFactory<TConcreteDiagram>,
  selectLineKeys: (string | undefined)[],
  addLinks: MdLinkModel<TConcreteDiagram>[],
  enumAssos: TEnumAssociate[],
  fgFocus: boolean,
) {
  entityAssos?.forEach((entityAsso) => {
    if (entityAsso.action === DOStatus.DELETED || !entityAsso.fgAggAsso) {
      return;
    }
    const source = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        const idElement = node.getExtras().idElement;
        const findCt = componentEntities.find(
          (componentEntity) => componentEntity.idComponentEntity === idElement,
        );
        return findCt?.idEntity === entityAsso.entityAssociate?.idUp;
      }
    });
    const target = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        const idElement = node.getExtras().idElement;
        const findCt = componentEntities.find(
          (componentEntity) => componentEntity.idComponentEntity === idElement,
        );
        return findCt?.idEntity === entityAsso.entityAssociate?.idDown;
      }
      if (
        node.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENTITY
      ) {
        if (!fgShowOutEntities && !fgFocus) {
          return;
        }
        const idElement = node.getExtras().idElement;
        return idElement === entityAsso.entityAssociate?.idDown;
      }
    });
    if (!source || !target) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType: EnumConcreteDiagramType.ASSOLINK,
      idElement: entityAsso.idComponentEntityAssociate,
    };
    const link = mdLinkFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    link.setSourcePort(source?.getPort(PortModelType.SOURCE) as MdPortModel);
    link.setTargetPort(target?.getPort(PortModelType.TARGET) as MdPortModel);
    if (selectLineKeys.includes(entityAsso.idEntityAssociate)) {
      link.setSelected(true);
    }
    addLinks.push(link);
  });

  enumAssos?.forEach((enumAsso) => {
    if (enumAsso.action === DOStatus.DELETED) {
      return;
    }
    const source = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        const idElement = node.getExtras().idElement;
        const findCe = componentEntities.find(
          (componentEntity) => componentEntity.idComponentEntity === idElement,
        );
        return findCe?.idEntity === enumAsso.idEntity;
      }
    });
    const target = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
        const idElement = node.getExtras().idElement;
        const findCe = componentEnums.find(
          (componentEnum) => componentEnum.idComponentEnum === idElement,
        );
        return findCe?.idEnum === enumAsso.idEnum;
      }
      if (node.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENUM) {
        if (!fgShowOutEntities && !fgFocus) {
          return;
        }
        const idElement = node.getExtras().idElement;
        return idElement === enumAsso.idEnum;
      }
    });
    if (!source || !target) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType: EnumConcreteDiagramType.ENUMASSOLINK,
      idElement: enumAsso.idEnumAssociate,
    };
    const link = mdLinkFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    link.setSourcePort(source?.getPort(PortModelType.SOURCE) as MdPortModel);
    link.setTargetPort(target?.getPort(PortModelType.TARGET) as MdPortModel);
    if (selectLineKeys.includes(enumAsso.idEnumAssociate)) {
      link.setSelected(true);
    }
    addLinks.push(link);
  });
}
