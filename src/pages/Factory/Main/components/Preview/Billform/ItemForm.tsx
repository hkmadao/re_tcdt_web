import { FC, ReactNode } from 'react';
import { Form, Space } from 'antd';

const ItemForm: FC<{ nodes: ReactNode[] }> = ({ nodes }) => {
  const [form] = Form.useForm();

  return (
    <>
      <Form form={form} layout={'inline'}>
        <Space direction="horizontal" size={2} wrap={true}>
          {nodes.map((i) => i)}
        </Space>
      </Form>
    </>
  );
};

export default ItemForm;
