import { FC, useState } from 'react';
import { Button, Modal, Space, message } from 'antd';
import {
  DeleteOutlined,
  DesktopOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus, TCommonResult } from '@/models';
import { useSelectedNode } from '../../../hooks';
import { fetchDtoProjectTree } from '../../../store';
import DescriptTreeAPI from '../../../api';
import { fetchEntityCollection } from '@/pages/ComponentDTO/ComponentDTODesign/store';

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
    const removeResult: TCommonResult<void> =
      await DescriptTreeAPI.dtoEntityCollectionRemove({
        ...selectedNode,
        idDtoEntityCollection: selectedNode?.id,
        action: DOStatus.DELETED,
      });
    if (removeResult.status === 1) {
      message.error(removeResult.message);
      return;
    }
    dispatch(fetchDtoProjectTree());
    setRemoveModalVisible(false);
  };

  const handleLoadData = () => {
    if (selectedNode) {
      dispatch(fetchEntityCollection({ id: selectedNode.id! }));
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
        title="删除实体空间确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将实体空间{' '}
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
