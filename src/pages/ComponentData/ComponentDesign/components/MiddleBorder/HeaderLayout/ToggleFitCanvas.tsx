import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntityComponent } from '@/pages/ComponentData/ComponentDesign/store';
import { ScanOutlined } from '@ant-design/icons';

const ZoomToFit: FC = () => {
  const dispatch = useDispatch();
  const { idComponent: idEntityCollection } = useSelector(
    selectEntityComponent,
  );

  const handleZoomToFit = () => {};

  return (
    <>
      <Tooltip overlay={'适合画布'}>
        <Button
          size={'small'}
          onClick={handleZoomToFit}
          disabled={!idEntityCollection}
          icon={<ScanOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default ZoomToFit;
