import { DefaultLinkModel } from '@projectstorm/react-diagrams';
import { MdModelType } from '../const';

export class MdLinkModel<T> extends DefaultLinkModel {
  constructor(extras?: T) {
    super({
      type: MdModelType.MDLINK,
      width: 4,
      locked: true,
      extras,
    });
  }
  getExtras(): T {
    return this.getOptions().extras;
  }
  setExtras(extras?: T) {
    this.getOptions().extras = extras;
  }
}
