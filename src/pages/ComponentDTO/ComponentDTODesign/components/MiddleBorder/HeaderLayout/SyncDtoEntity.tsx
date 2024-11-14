import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEntites,
  selectEntityCollection,
  selectNotDeleteEntities,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { SyncOutlined } from '@ant-design/icons';

const SyncDtoEntity: FC = () => {
  const dispatch = useDispatch();
  const dtoCollection = useSelector(selectEntityCollection);
  const dtoEntities = useSelector(selectNotDeleteEntities);

  const handleSyncEntities = () => {
    const refIds = dtoEntities.map((entity) => entity.idRef || '');
    dispatch(fetchEntites(refIds));
  };

  return (
    <>
      <Tooltip overlay={'同步DTO实体'}>
        <Button
          size={'small'}
          onClick={handleSyncEntities}
          disabled={!dtoCollection?.idDtoEntityCollection}
          icon={<SyncOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default SyncDtoEntity;
