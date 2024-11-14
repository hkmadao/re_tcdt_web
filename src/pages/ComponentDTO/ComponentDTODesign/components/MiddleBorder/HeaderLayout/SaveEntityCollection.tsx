import React, { FC } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveEntityCollection,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { DOStatus } from '@/models/enums';
import { SaveOutlined } from '@ant-design/icons';

const SaveEntityCollection: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);

  const handleSave = () => {
    dispatch(
      saveEntityCollection({
        ...entityCollection!,
        action:
          entityCollection?.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : entityCollection?.action,
      }),
    );
  };

  return (
    <>
      <Tooltip overlay={'保存'}>
        <Button
          size={'small'}
          onClick={handleSave}
          disabled={!entityCollection?.idDtoEntityCollection}
          icon={<SaveOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default SaveEntityCollection;
