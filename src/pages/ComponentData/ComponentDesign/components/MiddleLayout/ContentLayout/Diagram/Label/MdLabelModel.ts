import { DefaultLabelModel } from '@projectstorm/react-diagrams';
import { MdModelType } from '../const';

export class MdLablModel extends DefaultLabelModel {
  constructor(props: any) {
    super({
      type: MdModelType.MDLABEL,
      extras: props,
    });
  }
}
