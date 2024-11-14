import { FC, useState } from 'react';
import { Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { TTree } from '@/pages/ComponentDTO/ComponentDTOTree/models';
import { fetchEntityCollection } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  useFgChange,
  useIdCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/hooks';

type TEntityCollectionTitlePros = {} & TTree;

const EntityCollectionTitleLayout: FC<TEntityCollectionTitlePros> = ({
  ...props
}) => {
  const dispatch = useDispatch();
  const fgChange = useFgChange();
  const idColl = useIdCollection();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOK = () => {
    dispatch(fetchEntityCollection({ id: props.id! }));
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDoubleClick = () => {
    if (props.id === idColl) {
      return;
    }
    if (fgChange) {
      setModalVisible(true);
      return;
    }
    dispatch(fetchEntityCollection({ id: props.id! }));
  };

  return (
    <>
      <span onDoubleClick={handleDoubleClick}>
        <Space size={30}>
          <span>{props.displayName}</span>
        </Space>
      </span>
      <Modal
        title="离开确认！"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOK}
      >
        数据未保存，是否放弃保存并离开！
      </Modal>
    </>
  );
};

export default EntityCollectionTitleLayout;
