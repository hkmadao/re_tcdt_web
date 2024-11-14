import React, { FC, useEffect, useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { diagramContentDivId } from '@/pages/ComponentData/ComponentDesign/conf';
import {
  actions,
  selectEntityComponent,
} from '@/pages/ComponentData/ComponentDesign/store';
import { ClearOutlined } from '@ant-design/icons';

const CleanAllElement: FC = () => {
  const dispatch = useDispatch();
  const component = useSelector(selectEntityComponent);
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
          size={'small'}
          onClick={handleOpenModal}
          disabled={
            component &&
            component.componentEntities?.length === 0 &&
            component.componentEntityAssociates?.length === 0 &&
            component.componentEnums?.length === 0 &&
            component.componentNodeUis?.length === 0
          }
          icon={<ClearOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        width={'500px'}
        title={'清空所有本组件所有元素确认'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <p>确定将本组件所有元素删除？</p>
      </Modal>
    </>
  );
};

export default CleanAllElement;
