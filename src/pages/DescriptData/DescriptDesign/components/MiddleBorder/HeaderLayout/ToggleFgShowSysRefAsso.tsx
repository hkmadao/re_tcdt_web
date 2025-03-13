import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
  selectFgFocus,
  selectFgShowSysRefAsso,
} from '@/pages/DescriptData/DescriptDesign/store';

const ToggleFgShowSysRefAsso: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const fgFocus = useSelector(selectFgFocus);
  const fgShowSysRefAsso = useSelector(selectFgShowSysRefAsso);

  const toggleShowSysRefAsso = () => {
    dispatch(actions.toggleShowSysRefAsso());
  };

  return (
    <>
      <Tooltip
        overlay={fgShowSysRefAsso ? '隐藏系统引用连线' : '显示系统引用连线'}
      >
        <Button
          onClick={toggleShowSysRefAsso}
          disabled={!entityCollection?.idEntityCollection || fgFocus}
          size={'small'}
          icon={
            <span>
              {fgShowSysRefAsso ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          }
        ></Button>
      </Tooltip>
    </>
  );
};

export default ToggleFgShowSysRefAsso;
