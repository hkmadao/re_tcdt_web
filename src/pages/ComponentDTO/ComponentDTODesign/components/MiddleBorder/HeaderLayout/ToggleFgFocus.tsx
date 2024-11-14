import React, { FC } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectElements,
  selectFgFocus,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';

const ToggleFgFocus: FC = () => {
  const dispatch = useDispatch();
  const fgFocus = useSelector(selectFgFocus);
  const selectedElements = useSelector(selectElements);

  const toggleFocus = () => {
    dispatch(actions.toggleFgFocus());
  };

  return (
    <>
      {fgFocus ? (
        <Button size={'small'} onClick={toggleFocus}>
          取消聚焦
        </Button>
      ) : (
        <Button
          size={'small'}
          onClick={toggleFocus}
          disabled={
            !selectedElements.selectNodes ||
            selectedElements.selectNodes.length === 0
          }
        >
          聚焦实体
        </Button>
      )}
    </>
  );
};

export default ToggleFgFocus;
