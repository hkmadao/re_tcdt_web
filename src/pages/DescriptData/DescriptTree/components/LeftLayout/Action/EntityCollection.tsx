import { FC, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import {
  DeleteOutlined,
  DesktopOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus } from '@/models';
import { useSelectedNode } from '../../../hooks';
import { removeCollection } from '../../../store';
import { fetchEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';

const EntityCollectionAction: FC = () => {
  const selectedNode = useSelectedNode();
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  /**弹出删除确认框 */
  const handleToRemoveModal = () => {
    setRemoveModalVisible(true);
  };

  /**删除取消 */
  const handleRemoveCloseModal = () => {
    setRemoveModalVisible(false);
  };

  /**删除 */
  const handleRemove = async () => {
    dispatch(
      removeCollection({
        ...selectedNode,
        idEntityCollection: selectedNode?.id!,
        action: DOStatus.DELETED,
      }),
    );
    setRemoveModalVisible(false);
  };

  const handleLoadData = () => {
    if (selectedNode) {
      dispatch(fetchEntityCollection({ id: selectedNode.id }));
    }
  };

  return (
    <>
      <Space size={'middle'}>
        <Button size={'small'} type={'default'} disabled={true}>
          <PlusCircleOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <EditOutlined />
        </Button>
        <Button size={'small'} onClick={handleToRemoveModal} type={'default'}>
          <DeleteOutlined />
        </Button>
        <Button size={'small'} onClick={handleLoadData} type={'default'}>
          <DesktopOutlined />
        </Button>
      </Space>
      <Modal
        title="删除实体集确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将实体集{' '}
          <b style={{ color: 'blue', fontSize: 16 }}>
            {selectedNode?.displayName}
          </b>{' '}
          删除?
        </p>
      </Modal>
    </>
  );
};

export default EntityCollectionAction;