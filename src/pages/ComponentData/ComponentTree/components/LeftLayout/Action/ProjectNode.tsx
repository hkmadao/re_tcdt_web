import { FC } from 'react';
import { Button, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

const ProjectNodeAction: FC = () => {
  return (
    <>
      <Space size={'middle'}>
        <Button size={'small'} type={'default'} disabled={true}>
          <PlusCircleOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <EditOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
};

export default ProjectNodeAction;
