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
  TEntity,
  TEntityAssociate,
  TEnum,
  TEnumAssociate,
  TNodeUi,
} from '@/pages/DescriptData/DescriptDesign/models';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdPortModel } from '../Port/MdPortModel';
import { MdLinkModel } from '../Link/MdLinkModel';

export function addEnumNodes(
  concreteType: EnumConcreteDiagramType,
  addEnums: TEnum[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {
  addEnums?.forEach((ddEnum) => {
    if (ddEnum.action === DOStatus.DELETED) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType,
      idElement: ddEnum.idEnum,
    };
    const node = mdNodeFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.SOURCE,
          idElement: ddEnum.idEnum,
          concreteType,
        },
      }),
    );
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.TARGET,
          idElement: ddEnum.idEnum,
          concreteType,
        },
      }),
    );
    const nodeUi = nodeUis?.find(
      (nodeUi) =>
        nodeUi.idElement === ddEnum.idEnum &&
        nodeUi.action !== DOStatus.DELETED,
    );
    node.setPosition(nodeUi?.x as number, nodeUi?.y as number);
    if (selectNodeKeys.includes(ddEnum.idEnum)) {
      node.setSelected(true);
    }
    addNodes.push(node);
  });
}

export function addEntityNodes(
  concreteType: EnumConcreteDiagramType,
  addEntities: TEntity[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TNodeUi[],
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
  entityAssos: TEntityAssociate[],
  allNodes: MdNodeModel<TConcreteDiagram>[],
  fgShowSysRefAsso: boolean,
  fgShowOutEntities: boolean,
  mdLinkFactory: MdLinkFactory<TConcreteDiagram>,
  selectLineKeys: (string | undefined)[],
  addLinks: MdLinkModel<TConcreteDiagram>[],
  enumAssos: TEnumAssociate[],
  fgShowEnumAsso: boolean,
  fgFocus: boolean,
) {
  entityAssos?.forEach((entityAsso) => {
    if (entityAsso.action === DOStatus.DELETED) {
      return;
    }
    if (entityAsso.fgSysRef && !fgShowSysRefAsso) {
      return;
    }
    const source = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        const idElement = node.getExtras().idElement;
        return idElement === entityAsso.idDown;
      }
    });
    const target = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        const idElement = node.getExtras().idElement;
        return idElement === entityAsso.idUp;
      }
      if (
        node.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENTITY
      ) {
        if (!fgShowOutEntities && !fgFocus) {
          return;
        }
        const idElement = node.getExtras().idElement;
        return idElement === entityAsso.idUp;
      }
    });
    if (!source || !target) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType: EnumConcreteDiagramType.ASSOLINK,
      idElement: entityAsso.idEntityAssociate,
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

  if (fgShowEnumAsso) {
    enumAssos?.forEach((enumAsso) => {
      if (enumAsso.action === DOStatus.DELETED) {
        return;
      }
      const source = allNodes.find((node) => {
        if (node.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
          const idElement = node.getExtras().idElement;
          return idElement === enumAsso.idEntity;
        }
      });
      const target = allNodes.find((node) => {
        if (node.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
          const idElement = node.getExtras().idElement;
          return idElement === enumAsso.idEnum;
        }
        if (
          node.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENUM
        ) {
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
}
