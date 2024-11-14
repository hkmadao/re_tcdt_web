import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { Input, Select, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEntityCollection,
  selectEntitys,
  actions,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { DOStatus } from '@/models/enums';
import { TDtoEntityCollection } from '../../../models';

const PanelLayout: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);
  const entitys = useSelector(selectEntitys);
  const dispatch = useDispatch();
  const { Option } = Select;
  const [options, setOptions] = useState<ReactNode[]>([]);

  useEffect(() => {
    const newOptions: ReactNode[] = [];
    entitys?.forEach((entity) => {
      if (entity.action === DOStatus.DELETED) {
        return;
      }
      newOptions.push(
        <Option key={entity.idDtoEntity} value={entity.idDtoEntity}>
          {entity.displayName}
        </Option>,
      );
    });
    setOptions(newOptions);
  }, [entityCollection]);

  useEffect(() => {}, []);

  const hanleChange = (targetName: keyof TDtoEntityCollection) => {
    return async (ce: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        actions.updateEntityCollection({
          ...entityCollection,
          [targetName]: ce.target.value,
        }),
      );
    };
  };

  const hanleSelect = (targetName: keyof TDtoEntityCollection) => {
    return async (value: any) => {
      dispatch(
        actions.updateEntityCollection({
          ...entityCollection,
          [targetName]: value,
        }),
      );
    };
  };

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          <Input
            size={'small'}
            value={entityCollection?.idDtoEntityCollection}
            readOnly
          />
        </Descriptions.Item>
        <Descriptions.Item label="显示名称">
          <Input
            size={'small'}
            onChange={hanleChange('displayName')}
            value={entityCollection.displayName}
          />
        </Descriptions.Item>
        <Descriptions.Item label="全包名">
          {entityCollection?.dtoModule?.path +
            '.' +
            entityCollection.packageName}
        </Descriptions.Item>
        <Descriptions.Item label="包名">
          <Input
            size={'small'}
            onChange={hanleChange('packageName')}
            value={entityCollection.packageName}
          />
        </Descriptions.Item>
        <Descriptions.Item label="主DTO实体">
          <Select
            style={{ minWidth: '100px' }}
            size={'small'}
            value={entityCollection.idMainDtoEntity}
            onChange={hanleSelect('idMainDtoEntity')}
          >
            {options}
          </Select>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PanelLayout;
