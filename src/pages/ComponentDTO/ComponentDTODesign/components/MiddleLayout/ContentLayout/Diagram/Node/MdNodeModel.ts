import { NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams';
import { MdModelType } from '../const';
import { MdPortModel } from '../Port/MdPortModel';

export class MdNodeModel<T> extends NodeModel<NodeModelGenerics> {
  constructor(props: T) {
    super({
      type: MdModelType.MDNODE,
      extras: props,
    });
  }
  getPort(name: string): MdPortModel | null {
    const port = super.getPort(name);
    return port ? <MdPortModel>port : null;
  }
  getExtras(): T {
    return this.getOptions().extras;
  }
  setExtras(extras: T) {
    this.getOptions().extras = extras;
  }
}
