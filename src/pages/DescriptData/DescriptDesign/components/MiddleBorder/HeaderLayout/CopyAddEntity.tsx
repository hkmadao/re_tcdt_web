import { FC, Key, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { TEntity, TEnum } from '@/pages/DescriptData/DescriptDesign/models';
import {
  actions,
  selectEntityCollection,
  selectModuleUi,
  selectDiagramUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { CopyOutlined } from '@ant-design/icons';
import SelectEntity from './SelectEntity';
import DescriptDataAPI from '../../../api';

const CopyAddEntity: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const moduleUi = useSelector(selectModuleUi);
  const diagramUi = useSelector(selectDiagramUi);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleComplete = async (entities: TEntity[], enums: TEnum[]) => {
    if (entities.length > 0) {
      const entityIds = entities.map((e) => e.idEntity);
      const resEntities = await DescriptDataAPI.getDetailByEntityIds({
        idEntityList: entityIds.join(','),
      });
      if (resEntities) {
        const entities = resEntities.map((enti) => {
          return {
            ...enti,
            enumAssociates: undefined,
            implementAssociates: undefined,
            upAssociates: undefined,
            downAssociates: undefined,
          };
        });
        dispatch(
          actions.copyAddElements({
            entities: entities,
            enums: [],
            moduleUi,
            diagramUi,
          }),
        );
      }
    }
    if (enums.length > 0) {
      const enumIds = enums.map((e) => e.idEnum);
      const resEnums = await DescriptDataAPI.getDetailByEnumIds({
        idEnumList: enumIds.join(','),
      });
      if (resEnums) {
        const enums = resEnums.map((ddEnum) => {
          return {
            ...ddEnum,
          };
        });
        dispatch(
          actions.copyAddElements({
            entities: [],
            enums: enums,
            moduleUi,
            diagramUi,
          }),
        );
      }
    }
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'复制增加...'}>
        <Button
          onClick={handleOpenModal}
          disabled={!entityCollection?.idEntityCollection}
          size={'small'}
          icon={<CopyOutlined />}
        ></Button>
      </Tooltip>
      <SelectEntity
        modalVisible={modalVisible}
        handleClose={handleClose}
        handleComplete={handleComplete}
      />
    </>
  );
};

export default CopyAddEntity;
