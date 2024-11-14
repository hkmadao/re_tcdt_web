import { FC } from 'react';
import { Button, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

const EmptyAction: FC = () => {
  const handleToAdd = () => {};

  const handleToEdit = () => {};

  const handleToDelete = () => {};

  return (
    <>
      <Space size={'middle'}>
        <Button
          size={'small'}
          onClick={handleToAdd}
          type={'default'}
          disabled={true}
        >
          <PlusCircleOutlined />
        </Button>
        <Button
          size={'small'}
          onClick={handleToEdit}
          type={'default'}
          disabled={true}
        >
          <EditOutlined />
        </Button>
        <Button
          size={'small'}
          onClick={handleToDelete}
          type={'default'}
          disabled={true}
        >
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
};

export default EmptyAction;
