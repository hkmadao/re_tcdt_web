import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { ScanOutlined } from '@ant-design/icons';

const ZoomToFit: FC = () => {
  const dispatch = useDispatch();
  const { idDtoEntityCollection } = useSelector(selectEntityCollection);

  const handleZoomToFit = () => {
    dispatch(actions.increaseZoomToFitCount());
  };

  return (
    <>
      <Tooltip overlay={'适合画布'}>
        <Button
          onClick={handleZoomToFit}
          disabled={!idDtoEntityCollection}
          size={'small'}
          icon={<ScanOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default ZoomToFit;
