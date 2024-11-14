import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { AimOutlined, StopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectElements,
  selectFgFocus,
} from '@/pages/DescriptData/DescriptDesign/store';

const ToggleFgFocus: FC = () => {
  const dispatch = useDispatch();
  const fgFocus = useSelector(selectFgFocus);
  const selectedElements = useSelector(selectElements);

  const toggleFocus = () => {
    dispatch(actions.toggleFgFocus());
  };

  return (
    <>
      <Tooltip overlay={fgFocus ? '取消聚焦' : '聚焦实体'}>
        <Button
          onClick={fgFocus ? toggleFocus : toggleFocus}
          disabled={
            !selectedElements.selectNodes ||
            selectedElements.selectNodes.length === 0
          }
          size={'small'}
          icon={<span>{fgFocus ? <StopOutlined /> : <AimOutlined />}</span>}
        ></Button>
      </Tooltip>
    </>
  );
};

export default ToggleFgFocus;
