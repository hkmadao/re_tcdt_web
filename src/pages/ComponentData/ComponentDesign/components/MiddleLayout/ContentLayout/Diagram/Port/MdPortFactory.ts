import { DiagramEngine } from '@projectstorm/react-diagrams';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { MdModelType } from '../const';
import { MdPortModel } from './MdPortModel';
import { TConcreteDiagram } from '@/pages/ComponentData/ComponentDesign/models';

export class MdPortFactory extends AbstractModelFactory<
  MdPortModel,
  DiagramEngine
> {
  constructor() {
    super(MdModelType.MDPORT);
  }

  generateModel(event: {
    initialConfig: { name: string } & TConcreteDiagram;
  }): MdPortModel {
    return new MdPortModel(event.initialConfig.name, event.initialConfig);
  }
}
