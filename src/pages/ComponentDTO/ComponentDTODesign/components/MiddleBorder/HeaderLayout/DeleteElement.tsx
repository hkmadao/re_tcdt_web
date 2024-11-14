import React, { FC, useEffect, useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { diagramContentDivId } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import {
  actions,
  selectElements,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteElement: FC = () => {
  const dispatch = useDispatch();
  const { selectLines, selectNodes } = useSelector(selectElements);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {}, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    dispatch(actions.deleteSelectElement());
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'删除所选元素'}>
        <Button
          onClick={handleOpenModal}
          disabled={selectNodes!.length + selectLines!.length === 0}
          size={'small'}
          icon={<DeleteOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        width={'500px'}
        title={'删除所选元素确认'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <p>确定将所选元素删除？</p>
      </Modal>
    </>
  );
};

export default DeleteElement;
