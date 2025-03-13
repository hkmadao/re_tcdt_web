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
  TDtoEntity,
  TDtoEntityAssociate,
  TDtoEnum,
  TDtoEnumAssociate,
  TDtoNodeUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { EnumConcreteDiagramType } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';
import { MdNodeModel } from '../Node/MdNodeModel';
import { MdPortModel } from '../Port/MdPortModel';
import { MdLinkModel } from '../Link/MdLinkModel';

export function addEnumNodes(
  concreteType: EnumConcreteDiagramType,
  addEnums: TDtoEnum[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TDtoNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {
  addEnums?.forEach((ddEnum) => {
    if (ddEnum.action === DOStatus.DELETED) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType,
      idElement: ddEnum.idDtoEnum,
    };
    const node = mdNodeFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.SOURCE,
          idElement: ddEnum.idDtoEnum,
          concreteType,
        },
      }),
    );
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.TARGET,
          idElement: ddEnum.idDtoEnum,
          concreteType,
        },
      }),
    );
    const nodeUi = nodeUis?.find(
      (nodeUi) =>
        nodeUi.idElement === ddEnum.idDtoEnum &&
        nodeUi.action !== DOStatus.DELETED,
    );
    node.setPosition(nodeUi?.x as number, nodeUi?.y as number);
    if (selectNodeKeys.includes(ddEnum.idDtoEnum)) {
      node.setSelected(true);
    }
    addNodes.push(node);
  });
}

export function addEntityNodes(
  concreteType: EnumConcreteDiagramType,
  addEntities: TDtoEntity[],
  mdNodeFactory: MdNodeFactory<TConcreteDiagram>,
  mdPortFactory: MdPortFactory,
  nodeUis: TDtoNodeUi[],
  selectNodeKeys: (string | undefined)[],
  addNodes: MdNodeModel<TConcreteDiagram>[],
) {
  addEntities?.forEach((entity) => {
    if (entity.action === DOStatus.DELETED) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType,
      idElement: entity.idDtoEntity,
    };
    const node = mdNodeFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.SOURCE,
          idElement: entity.idDtoEntity,
          concreteType,
        },
      }),
    );
    node.addPort(
      mdPortFactory.generateModel({
        initialConfig: {
          name: PortModelType.TARGET,
          idElement: entity.idDtoEntity,
          concreteType,
        },
      }),
    );
    const nodeUi = nodeUis?.find(
      (nodeUi) =>
        nodeUi.idElement === entity.idDtoEntity &&
        nodeUi.action !== DOStatus.DELETED,
    );
    node.setPosition(nodeUi?.x as number, nodeUi?.y as number);
    if (selectNodeKeys.includes(entity.idDtoEntity)) {
      node.setSelected(true);
    }
    addNodes.push(node);
  });
}

export function associateElements(
  entityAssos: TDtoEntityAssociate[],
  allNodes: MdNodeModel<TConcreteDiagram>[],
  mdLinkFactory: MdLinkFactory<TConcreteDiagram>,
  selectLineKeys: (string | undefined)[],
  addLinks: MdLinkModel<TConcreteDiagram>[],
  enumAssos: TDtoEnumAssociate[],
  fgFocus: boolean,
  fgShowSysRefAsso: boolean,
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
    });
    if (!source || !target) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType: EnumConcreteDiagramType.ASSOLINK,
      idElement: entityAsso.idDtoEntityAssociate,
    };
    const link = mdLinkFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    link.setSourcePort(source?.getPort(PortModelType.SOURCE) as MdPortModel);
    link.setTargetPort(target?.getPort(PortModelType.TARGET) as MdPortModel);
    if (selectLineKeys.includes(entityAsso.idDtoEntityAssociate)) {
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
        return idElement === enumAsso.idDtoEntity;
      }
    });
    const target = allNodes.find((node) => {
      if (node.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
        const idElement = node.getExtras().idElement;
        return idElement === enumAsso.idDtoEnum;
      }
    });
    if (!source || !target) {
      return;
    }
    const concreteDiagram: TConcreteDiagram = {
      concreteType: EnumConcreteDiagramType.ENUMASSOLINK,
      idElement: enumAsso.idDtoEnumAssociate,
    };
    const link = mdLinkFactory.generateModel({
      initialConfig: concreteDiagram,
    });
    link.setSourcePort(source?.getPort(PortModelType.SOURCE) as MdPortModel);
    link.setTargetPort(target?.getPort(PortModelType.TARGET) as MdPortModel);
    if (selectLineKeys.includes(enumAsso.idDtoEnumAssociate)) {
      link.setSelected(true);
    }
    addLinks.push(link);
  });
}
