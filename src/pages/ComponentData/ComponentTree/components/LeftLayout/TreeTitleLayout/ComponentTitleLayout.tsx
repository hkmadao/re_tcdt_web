import { FC, useState } from 'react';
import { Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import { fetchComponent } from '@/pages/ComponentData/ComponentDesign/store';
import {
  useFgChange,
  useIdCollection,
} from '@/pages/ComponentData/ComponentDesign/hooks';

type TComponentTitleLayoutProps = {} & TTree;

const ComponetTitleLayout: FC<TComponentTitleLayoutProps> = ({ ...props }) => {
  const dispatch = useDispatch();
  const fgChange = useFgChange();
  const idColl = useIdCollection();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOK = () => {
    dispatch(fetchComponent({ id: props.id! }));
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
    dispatch(fetchComponent({ id: props.id! }));
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

export default ComponetTitleLayout;
