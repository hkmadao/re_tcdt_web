import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { BorderInnerOutlined, StopOutlined } from '@ant-design/icons';
import {
  actions,
  selectAddElementStatus,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';

const AddEnum: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  const addElementStatus = useSelector(selectAddElementStatus);

  const handleAddEnum = () => {
    dispatch(
      actions.setAddElementStatus({
        addElementStatus: addElementStatus === 'enum' ? undefined : 'enum',
      }),
    );
  };

  return (
    <>
      <Tooltip overlay={addElementStatus === 'enum' ? '取消' : '添加枚举'}>
        <Button
          onClick={handleAddEnum}
          disabled={!entityCollection?.idEntityCollection}
          size={'small'}
          icon={
            <span>
              {addElementStatus === 'enum' ? (
                <StopOutlined />
              ) : (
                <BorderInnerOutlined />
              )}
            </span>
          }
        ></Button>
      </Tooltip>
    </>
  );
};

export default AddEnum;
