import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveComponent,
  selectEntityComponent,
} from '@/pages/ComponentData/ComponentDesign/store';
import { DOStatus } from '@/models/enums';
import { SaveOutlined } from '@ant-design/icons';

const SaveComponent: FC = () => {
  const dispatch = useDispatch();
  const component = useSelector(selectEntityComponent);

  const handleSave = () => {
    dispatch(
      saveComponent({
        ...component!,
        action:
          component?.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : component?.action,
      }),
    );
  };

  return (
    <>
      <Tooltip overlay={'保存'}>
        <Button
          size={'small'}
          onClick={handleSave}
          disabled={!component?.idComponent}
          icon={<SaveOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default SaveComponent;
