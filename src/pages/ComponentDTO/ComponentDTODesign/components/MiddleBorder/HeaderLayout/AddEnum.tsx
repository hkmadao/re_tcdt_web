import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectAddElementStatus,
  selectEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { StopOutlined, BorderInnerOutlined } from '@ant-design/icons';

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
          size={'small'}
          onClick={handleAddEnum}
          disabled={!entityCollection?.idDtoEntityCollection}
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
