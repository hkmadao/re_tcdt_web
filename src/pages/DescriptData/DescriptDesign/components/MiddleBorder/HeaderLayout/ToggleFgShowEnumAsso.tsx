import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
  selectFgFocus,
  selectFgShowEnumAsso,
} from '@/pages/DescriptData/DescriptDesign/store';

const ToggleFgShowEnumAsso: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const fgFocus = useSelector(selectFgFocus);
  const fgShowEnumAsso = useSelector(selectFgShowEnumAsso);

  const toggleShowSystemInterfaces = () => {
    dispatch(actions.toggleFgShowEnumAsso());
  };

  return (
    <>
      <Tooltip overlay={fgShowEnumAsso ? '隐藏枚举连线' : '显示枚举连线'}>
        <Button
          onClick={toggleShowSystemInterfaces}
          disabled={!entityCollection?.idEntityCollection || fgFocus}
          size={'small'}
          icon={
            <span>
              {fgShowEnumAsso ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          }
        ></Button>
      </Tooltip>
    </>
  );
};

export default ToggleFgShowEnumAsso;
