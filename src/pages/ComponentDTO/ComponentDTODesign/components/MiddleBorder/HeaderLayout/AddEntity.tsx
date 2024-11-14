import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectAddElementStatus,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { FileAddOutlined, StopOutlined } from '@ant-design/icons';

const AddEntity: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const addElementStatus = useSelector(selectAddElementStatus);

  const handleAddEntity = () => {
    dispatch(
      actions.setAddElementStatus({
        addElementStatus: addElementStatus === 'entity' ? undefined : 'entity',
      }),
    );
  };

  return (
    <>
      <Tooltip overlay={addElementStatus === 'entity' ? '取消' : '添加实体'}>
        <Button
          size={'small'}
          onClick={handleAddEntity}
          disabled={!entityCollection?.idDtoEntityCollection}
          icon={
            <span>
              {addElementStatus === 'entity' ? (
                <StopOutlined />
              ) : (
                <FileAddOutlined />
              )}
            </span>
          }
        ></Button>
      </Tooltip>
    </>
  );
};

export default AddEntity;
