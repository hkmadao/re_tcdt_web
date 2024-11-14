import MdNodeItem from './MdNodeItem';
import { MdNodeModel } from './MdNodeModel';
import {
  AbstractReactFactory,
  GenerateWidgetEvent,
} from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { MdModelType } from '../const';

export class MdNodeFactory<T> extends AbstractReactFactory<
  MdNodeModel<T>,
  DiagramEngine
> {
  constructor() {
    super(MdModelType.MDNODE);
  }

  generateReactWidget(event: GenerateWidgetEvent<MdNodeModel<T>>): JSX.Element {
    return <MdNodeItem engine={this.engine} node={event.model} />;
  }

  generateModel(event: { initialConfig: T }) {
    return new MdNodeModel<T>(event.initialConfig);
  }
}
