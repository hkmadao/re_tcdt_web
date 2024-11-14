import { FC, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus } from '@/models';
import { useSelectedNode } from '../../../hooks';
import { TDtoModule } from '../../../models';
import { addDtoModule } from '../../../store';

const SubProjectAction: FC = () => {
  const [form] = Form.useForm<TDtoModule>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const selectedNode = useSelectedNode();
  const dispatch = useDispatch();

  const handleToAdd = () => {
    form.resetFields();
    const dtoModule = {
      idSubProject: selectedNode?.id,
    };
    form.setFieldsValue(dtoModule);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const dtoModule: TDtoModule = await form.validateFields();
    dtoModule.action = DOStatus.NEW;
    dispatch(addDtoModule(dtoModule));
    setModalVisible(false);
  };

  return (
    <>
      <Space size={'middle'}>
        <Button size={'small'} onClick={handleToAdd} type={'default'}>
          <PlusCircleOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <EditOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <DeleteOutlined />
        </Button>
      </Space>
      <Modal
        title="添加DTO模块"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAdd}
      >
        <Form form={form}>
          <Form.Item label="所属子项目" name={'idSubProject'}>
            <Select disabled>
              <Select.Option value={selectedNode?.id}>
                {selectedNode?.displayName}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="DTO模块包名" name={'path'}>
            <Input placeholder="请输入DTO模块包名" />
          </Form.Item>
          <Form.Item label="DTO模块名称" name={'displayName'}>
            <Input placeholder="请输入DTO模块显示名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SubProjectAction;
