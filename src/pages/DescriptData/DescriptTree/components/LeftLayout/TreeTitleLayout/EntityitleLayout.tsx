import { FC, useEffect, useState } from 'react';
import { Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';
import { fetchEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import { EnumTreeNodeType } from '../../../conf';
import {
  useIdCollection,
  useFgChange,
} from '@/pages/DescriptData/DescriptDesign/hooks';

const EntityTitleLayout: FC<TTree> = ({ ...props }) => {
  const dispatch = useDispatch();
  const fgChange = useFgChange();
  const idColl = useIdCollection();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOK = () => {
    if (props.idParent) {
      dispatch(
        fetchEntityCollection({
          id: props.idParent,
          idElement: props.id,
          concreteType:
            props.level === EnumTreeNodeType.ENTITY_LEVEL
              ? EnumConcreteDiagramType.ENTITY
              : EnumConcreteDiagramType.ENUM,
        }),
      );
    }
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDoubleClick = () => {
    if (fgChange && props.idParent !== idColl) {
      setModalVisible(true);
      return;
    }
    if (props.idParent) {
      dispatch(
        fetchEntityCollection({
          id: props.idParent,
          idElement: props.id,
          concreteType:
            props.level === EnumTreeNodeType.ENTITY_LEVEL
              ? EnumConcreteDiagramType.ENTITY
              : EnumConcreteDiagramType.ENUM,
        }),
      );
    }
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

export default EntityTitleLayout;
