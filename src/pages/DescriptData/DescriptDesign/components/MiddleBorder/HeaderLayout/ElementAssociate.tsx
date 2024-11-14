import React, { FC, useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DisconnectOutlined, ApiOutlined } from '@ant-design/icons';
import {
  actions,
  selectConnectionMode,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';

const ElementAssociate: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const connectionMode = useSelector(selectConnectionMode);

  const handleToAssociate = () => {
    dispatch(actions.setConnectionMode({ connectionMode: !connectionMode }));
  };

  return (
    <>
      <Tooltip overlay={connectionMode ? '取消连线' : '连线'}>
        <Button
          onClick={handleToAssociate}
          disabled={!entityCollection?.idEntityCollection}
          size={'small'}
          icon={
            <span>
              {connectionMode ? <ApiOutlined /> : <DisconnectOutlined />}
            </span>
          }
        ></Button>
      </Tooltip>
    </>
  );
};

export default ElementAssociate;
