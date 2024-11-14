import { ChangeEvent, FC, useEffect } from 'react';
import { Input, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEntityCollection,
  actions,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntityCollection } from '../../../models';

const PanelLayout: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  useEffect(() => {}, []);

  const handleChange = (targetName: keyof TEntityCollection) => {
    return async (ce: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        actions.updateEntityCollection({
          ...entityCollection,
          [targetName]: ce.target.value,
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
            value={entityCollection?.idEntityCollection}
            readOnly
          />
        </Descriptions.Item>
        <Descriptions.Item label="显示名称">
          <Input
            size={'small'}
            onChange={handleChange('displayName')}
            value={entityCollection.displayName}
          />
        </Descriptions.Item>
        <Descriptions.Item label="包名">
          <Input
            size={'small'}
            onChange={handleChange('packageName')}
            value={entityCollection.packageName}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PanelLayout;
