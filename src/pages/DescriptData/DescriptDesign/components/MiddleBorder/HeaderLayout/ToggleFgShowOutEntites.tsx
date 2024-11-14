import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
  selectFgFocus,
  selectFgShowOutEntities,
} from '@/pages/DescriptData/DescriptDesign/store';

const ToggleFgShowOutEntites: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const fgFocus = useSelector(selectFgFocus);
  const fgShowOutEntities = useSelector(selectFgShowOutEntities);

  const toggleShowSystemInterfaces = () => {
    dispatch(actions.toggleFgShowOutEntities());
  };

  return (
    <>
      <Tooltip overlay={fgShowOutEntities ? '隐藏外部实体' : '显示外部实体'}>
        <Button
          onClick={toggleShowSystemInterfaces}
          disabled={!entityCollection?.idEntityCollection || fgFocus}
          size={'small'}
          icon={
            <span>
              {fgShowOutEntities ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          }
        ></Button>
      </Tooltip>
    </>
  );
};

export default ToggleFgShowOutEntites;
