import {
  DefaultPortModelGenerics,
  LinkModel,
  PortModel,
} from '@projectstorm/react-diagrams';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { MdModelType, PortModelType } from '../const';
import { MdLinkModel } from '../Link/MdLinkModel';
import { TConcreteDiagram } from '@/pages/ComponentData/ComponentDesign/models';

export class MdPortModel extends PortModel<DefaultPortModelGenerics> {
  constructor(name: string, extras: TConcreteDiagram) {
    super({
      type: MdModelType.MDPORT,
      name: name,
      extras,
    });
  }

  getExtras(): TConcreteDiagram {
    return this.getOptions().extras;
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    const link = super.createLinkModel();
    if (!link && factory) {
      return factory.generateModel({});
    }
    return link || new MdLinkModel();
  }

  canLinkToPort(port: MdPortModel): boolean {
    // port是否被允许接出去
    return (
      this.getName() === PortModelType.SOURCE &&
      port.getName() === PortModelType.TARGET
    );
  }
}
