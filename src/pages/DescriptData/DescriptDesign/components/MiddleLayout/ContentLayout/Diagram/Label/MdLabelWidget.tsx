import { FC } from 'react';
import { MdLablModel } from './MdLabelModel';

export type TLabelWidgetProps = {
  model: MdLablModel;
};

/**标签内容 */
const MdLabelWidget: FC<TLabelWidgetProps> = (props) => {
  const { model } = props;

  return (
    <g>
      <g>{model.serialize().label}</g>
    </g>
  );
};

export default MdLabelWidget;
