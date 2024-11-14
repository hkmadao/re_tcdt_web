import { FC, useEffect, useState } from 'react';
import { Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { EnumTreeNodeType } from '../../../conf';
import { TTree } from '../../../models';
import { fetchEntityCollection } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { EnumConcreteDiagramType } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import {
  useFgChange,
  useIdCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/hooks';

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
