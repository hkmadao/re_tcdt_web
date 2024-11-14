import React, { FC, useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DOStatus } from '@/models/enums';
import { nanoid } from '@reduxjs/toolkit';
import {
  actions,
  selectConnectionMode,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { TDtoEnum } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { ApiOutlined, DisconnectOutlined } from '@ant-design/icons';

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
          size={'small'}
          onClick={handleToAssociate}
          disabled={!entityCollection?.idDtoEntityCollection}
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
