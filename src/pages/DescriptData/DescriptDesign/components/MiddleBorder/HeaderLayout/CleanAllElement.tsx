import { FC, useEffect, useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ClearOutlined } from '@ant-design/icons';
import { diagramContentDivId } from '@/pages/DescriptData/DescriptDesign/conf';
import {
  actions,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';

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
            entityCollection.nodeUis.length === 0 &&
            entityCollection.entities.length === 0 &&
            entityCollection.enums.length === 0 &&
            entityCollection.enumAssociates.length === 0 &&
            entityCollection.entityAssociates.length === 0
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
