import { FC, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntity, TEnum } from '@/pages/DescriptData/DescriptDesign/models';
import SelectEntity from './SelectEntity';

const ImportOutEntity: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleComplete = (entities: TEntity[], enums: TEnum[]) => {
    dispatch(
      actions.addOutElements({
        outEntities: entities,
        outEnums: enums,
      }),
    );
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'引入实体...'}>
        <Button
          onClick={handleOpenModal}
          disabled={!entityCollection?.idEntityCollection}
          size={'small'}
          icon={<ImportOutlined />}
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

export default ImportOutEntity;
