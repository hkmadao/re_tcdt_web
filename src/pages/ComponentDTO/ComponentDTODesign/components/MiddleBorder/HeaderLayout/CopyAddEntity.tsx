import { FC, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  TDtoEntity,
  TDtoEnum,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  actions,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TAttribute,
  TEntity,
  TEnum,
  TEnumAttribute,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  selectModuleUi,
  selectDiagramUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { CopyOutlined } from '@ant-design/icons';
import DescriptDataAPI from '@/pages/DescriptData/DescriptDesign/api';
import SelectEntity from '@/pages/DescriptData/DescriptDesign/components/MiddleBorder/HeaderLayout/SelectEntity';

const CopyAddEntity: FC = () => {
  const dispatch = useDispatch();
  const dtoEntityCollection = useSelector(selectEntityCollection);
  const moduleUi = useSelector(selectModuleUi);
  const diagramUi = useSelector(selectDiagramUi);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleComplete = async (entities: TEntity[], enums: TEnum[]) => {
    if (entities.length > 0) {
      const entityIds = entities.map((e) => e.idEntity);
      const resEntities = await DescriptDataAPI.getDetailByEntityIds({
        idEntityList: entityIds.join(','),
      });
      if (resEntities) {
        const dtoEntities: TDtoEntity[] = [];
        resEntities.forEach((ddEntity) => {
          let dtoEntity: TDtoEntity = {
            ...ddEntity,
            idDtoEntity: ddEntity.idEntity,
            idRef: ddEntity.idEntity,
            refEntity: ddEntity,
            deAttributes: [],
            dcAttributes: [],
          };
          const attrs: TAttribute[] = ddEntity.attributes || [];
          attrs.forEach((attr) => {
            dtoEntity!.deAttributes!.push({
              ...attr,
              idRefAttribute: attr.idAttribute,
              idDtoEntity: ddEntity.idEntity,
              idDtoEntityAttribute: attr.idAttribute!,
            });
          });
          dtoEntities.push(dtoEntity);
        });
        dispatch(
          actions.copyAddElements({
            entities: dtoEntities,
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
        const dtoEnums: TDtoEnum[] = [];
        resEnums.forEach((ddEnum) => {
          let dtoEnum: TDtoEnum = {
            ...ddEnum,
            idDtoEnum: ddEnum.idEnum,
            idRef: ddEnum.idEnum,
            refEnum: ddEnum,
            dtoEnumAttributes: [],
          };
          const attrs: TEnumAttribute[] = ddEnum.attributes || [];
          attrs.forEach((attr) => {
            dtoEnum!.dtoEnumAttributes!.push({
              ...attr,
              idRef: attr.idEnumAttribute!,
              idDtoEnumAttribute: attr.idEnumAttribute,
              idDtoEnum: ddEnum.idEnum,
            });
          });
          dtoEnums.push(dtoEnum);
        });
        dispatch(
          actions.copyAddElements({
            entities: [],
            enums: dtoEnums,
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
          size={'small'}
          onClick={handleOpenModal}
          disabled={!dtoEntityCollection?.idDtoEntityCollection}
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
