import {
  DefaultLinkFactory,
  DefaultLinkModel,
  DefaultLinkPointWidget,
  DefaultLinkWidget,
} from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { MdLinkModel } from './MdLinkModel';
import { MdModelType } from '../const';
import MdLinkWidget from './MdLinkWidget';

export class MdLinkFactory<T> extends DefaultLinkFactory {
  constructor() {
    super(MdModelType.MDLINK);
  }

  generateReactWidget(event: GenerateWidgetEvent<MdLinkModel<T>>): JSX.Element {
    return <MdLinkWidget link={event.model} diagramEngine={this.engine} />;
  }

  generateModel(event: { initialConfig: T }): MdLinkModel<T> {
    return new MdLinkModel<T>(event.initialConfig);
  }
}
