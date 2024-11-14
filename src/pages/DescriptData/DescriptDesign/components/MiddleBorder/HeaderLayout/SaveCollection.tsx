import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveEntityCollection,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';
import { SaveOutlined } from '@ant-design/icons';
import { DOStatus } from '@/models/enums';

const SaveCollection: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);

  const handleSave = () => {
    dispatch(
      saveEntityCollection({
        ...entityCollection!,
        action:
          entityCollection?.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : entityCollection?.action,
      }),
    );
  };

  return (
    <>
      <Tooltip overlay={'保存'}>
        <Button
          onClick={handleSave}
          disabled={!entityCollection?.idEntityCollection}
          size={'small'}
          icon={<SaveOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default SaveCollection;
