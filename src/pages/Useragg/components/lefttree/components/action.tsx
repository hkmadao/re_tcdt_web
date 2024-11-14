import { FC } from 'react';
import { Button, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

const NodeAction: FC = () => {
  const handleToAdd = () => {};

  const handleToEdit = () => {};

  const handleToDelete = () => {};

  return (
    <>
      <div
        style={{
          marginBottom: '5px',
        }}
      >
        <Space size={'small'}>
          <Button onClick={handleToAdd} type={'default'}>
            <PlusCircleOutlined />
          </Button>
          <Button onClick={handleToEdit} type={'default'}>
            <EditOutlined />
          </Button>
          <Button onClick={handleToDelete} type={'default'}>
            <DeleteOutlined />
          </Button>
        </Space>
      </div>
    </>
  );
};

export default NodeAction;
