import { FC, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { ScissorOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEntityCollection,
  selectFgFocus,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntity, TEnum } from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';
import { moveInElements } from '@/pages/DescriptData/DescriptDesign/store/move-in-entities';
import SelectEntity from './SelectEntity';

const JoinEntity: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const fgFocus = useSelector(selectFgFocus);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleComplete = (entities: TEntity[], enums: TEnum[]) => {
    dispatch(
      moveInElements({
        entityCollection: {
          ...entityCollection!,
          action:
            entityCollection?.action === DOStatus.UNCHANGED
              ? DOStatus.UPDATED
              : entityCollection?.action,
        },
        moveData: {
          entities: entities,
          enums: enums,
        },
      }),
    );
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'移入实体...'}>
        <Button
          onClick={handleOpenModal}
          disabled={!entityCollection?.idEntityCollection || fgFocus}
          size={'small'}
          icon={<ScissorOutlined />}
        ></Button>
      </Tooltip>
      <SelectEntity
        modalVisible={modalVisible}
        handleClose={handleClose}
        handleComplete={handleComplete}
        idSubProject={entityCollection.idSubProject}
        idCollection={entityCollection.idEntityCollection}
      />
    </>
  );
};

export default JoinEntity;
