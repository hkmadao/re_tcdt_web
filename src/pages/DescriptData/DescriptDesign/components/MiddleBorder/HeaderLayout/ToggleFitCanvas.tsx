import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { ScanOutlined, StopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';

const ZoomToFit: FC = () => {
  const dispatch = useDispatch();
  const { idEntityCollection } = useSelector(selectEntityCollection);

  const handleZoomToFit = () => {
    dispatch(actions.increaseZoomToFitCount());
  };

  return (
    <>
      <Tooltip overlay={'适合画布...'}>
        <Button
          onClick={handleZoomToFit}
          disabled={!idEntityCollection}
          size={'small'}
          icon={<ScanOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default ZoomToFit;
