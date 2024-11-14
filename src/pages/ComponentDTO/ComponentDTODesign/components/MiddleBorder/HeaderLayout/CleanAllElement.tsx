import React, { FC, useEffect, useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { diagramContentDivId } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import {
  actions,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { ClearOutlined } from '@ant-design/icons';

const CleanAllElement: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {}, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    dispatch(actions.cleanAllElement());
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'清空所有元素'}>
        <Button
          onClick={handleOpenModal}
          disabled={
            entityCollection.dtoNodeUis.length === 0 &&
            entityCollection.dtoEntities.length === 0 &&
            entityCollection.dtoEnums.length === 0 &&
            entityCollection.dtoEnumAssociates.length === 0 &&
            entityCollection.deAssociates.length === 0
          }
          size={'small'}
          icon={<ClearOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        width={'500px'}
        title={'删除实体集所有元素确认'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <p>确定将本实体集所有元素删除？</p>
      </Modal>
    </>
  );
};

export default CleanAllElement;
