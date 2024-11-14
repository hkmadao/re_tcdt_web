import { DiagramEngine } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { MdLablModel } from './MdLabelModel';
import MdLabelWidget from './MdLabelWidget';
import { MdModelType } from '../const';

export class MdLabelFactory extends AbstractReactFactory<
  MdLablModel,
  DiagramEngine
> {
  constructor() {
    super(MdModelType.MDLABEL);
  }

  generateReactWidget(event: { model: MdLablModel }): JSX.Element {
    return (
      <>
        <MdLabelWidget model={event.model} />
      </>
    );
  }

  generateModel(event: any): MdLablModel {
    return new MdLablModel({});
  }
}
