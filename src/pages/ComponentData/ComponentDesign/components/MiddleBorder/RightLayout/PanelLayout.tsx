import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { Input, Select, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityComponent,
} from '@/pages/ComponentData/ComponentDesign/store';
import { TComponent } from '@/pages/ComponentData/ComponentDesign/models';
import { DOStatus } from '@/models/enums';
import { EnumComponentType } from '../../../conf';

const PanelLayout: FC = () => {
  const component = useSelector(selectEntityComponent);
  const dispatch = useDispatch();
  const { Option } = Select;
  const [options, setOptions] = useState<ReactNode[]>([]);

  useEffect(() => {
    const newOptions: ReactNode[] = [];
    component.componentEntities?.forEach((entity) => {
      if (entity.action === DOStatus.DELETED) {
        return;
      }
      newOptions.push(
        <Option key={entity.idComponentEntity} value={entity.idComponentEntity}>
          {entity.ddEntity?.displayName}
        </Option>,
      );
    });
    setOptions(newOptions);
  }, [component]);

  useEffect(() => {}, []);

  const handleChange = (targetName: keyof TComponent) => {
    return async (ce: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        actions.updateComponent({
          ...component,
          [targetName]: ce.target.value,
        }),
      );
    };
  };

  const hanleSelect = (targetName: keyof TComponent) => {
    return async (value: any) => {
      dispatch(actions.updateComponent({ ...component, [targetName]: value }));
    };
  };

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          <Input size={'small'} value={component?.idComponent} readOnly />
        </Descriptions.Item>
        <Descriptions.Item label="组件类型">
          <Select
            style={{ minWidth: '100px' }}
            size={'small'}
            value={component.componentType}
            disabled
          >
            <Select.Option value={EnumComponentType.Single}>
              {'普通组件'}
            </Select.Option>
            <Select.Option value={EnumComponentType.Combination}>
              {'组合实体组件'}
            </Select.Option>
            <Select.Option value={EnumComponentType.Enum}>
              {'枚举组件'}
            </Select.Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="全包名">
          {component?.componentModule?.path + '.' + component?.packageName}
        </Descriptions.Item>
        <Descriptions.Item label="包名">
          <Input
            size={'small'}
            onChange={handleChange('packageName')}
            value={component?.packageName}
          />
        </Descriptions.Item>
        <Descriptions.Item label="显示名称">
          <Input
            size={'small'}
            onChange={handleChange('displayName')}
            value={component?.displayName}
          />
        </Descriptions.Item>
        <Descriptions.Item label="主实体">
          <Select
            style={{ minWidth: '100px' }}
            size={'small'}
            value={component?.idMainComponentEntity}
            onChange={hanleSelect('idMainComponentEntity')}
          >
            {options}
          </Select>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PanelLayout;
