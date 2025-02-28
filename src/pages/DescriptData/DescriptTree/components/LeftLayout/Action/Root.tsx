import { FC, useState } from 'react';
import { Button, Form, Input, Modal, Space, Select } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { TProject } from '../../../models';
import { DOStatus } from '@/models';
import { addProject } from '../../../store';

const RootAction: FC = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const [form] = Form.useForm<TProject>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleToAdd = () => {
    form.resetFields();
    const entityCollection: TProject = {
      idProject: '',
      fileNameType: 'PascalCase',
    };
    form.setFieldsValue(entityCollection);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const project: TProject = await form.validateFields();
    project.action = DOStatus.NEW;
    dispatch(addProject(project));
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
        title="添加项目"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAdd}
      >
        <Form form={form}>
          <Form.Item label="后台项目模板编号" name={'templateCode'}>
            <Input placeholder="请输入后台项目模板编号" />
          </Form.Item>
          <Form.Item label="前端项目模板编号" name={'webTemplateCode'}>
            <Input placeholder="请输入前端项目模板编号" />
          </Form.Item>
          <Form.Item label="模板文件名称样式" name={'fileNameType'}>
            <Select placeholder={'请选择'}>
              <Option value={'PascalCase'}>大驼峰命名</Option>
              <Option value={'SnakeCase'}>下划线命名</Option>
            </Select>
          </Form.Item>
          <Form.Item label="项目编号" name={'code'}>
            <Input placeholder="请输入项目编号" />
          </Form.Item>
          <Form.Item label="项目显示名称" name={'displayName'}>
            <Input placeholder="请输入项目显示名称" />
          </Form.Item>
          <Form.Item label="项目说明" name={'note'}>
            <Input.TextArea
              showCount
              maxLength={200}
              placeholder="请输入项目说明"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RootAction;
