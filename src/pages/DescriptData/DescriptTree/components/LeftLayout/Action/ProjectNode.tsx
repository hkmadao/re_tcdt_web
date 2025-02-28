import { FC, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { TSubProject, TProject } from '../../../models';
import { DOStatus } from '@/models';
import { addModule, removeProject, updateProject } from '../../../store';
import { useSelectedNode } from '../../../hooks';

const ProjectNodeAction: FC = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const selectedNode = useSelectedNode();
  const [form] = Form.useForm<TSubProject>();
  const [editForm] = Form.useForm<TProject>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);

  const handleToAdd = () => {
    form.resetFields();
    const moduleParam: TSubProject = {
      idProject: selectedNode?.id,
      idSubProject: '',
    };
    form.setFieldsValue(moduleParam);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const moduleParam: TSubProject = await form.validateFields();
    moduleParam.action = DOStatus.NEW;
    dispatch(addModule(moduleParam));
    setModalVisible(false);
  };

  const handleToEdit = () => {
    editForm.resetFields();
    editForm.setFieldsValue({ ...selectedNode, idProject: selectedNode?.id! });
    setEditModalVisible(true);
  };

  const handleEditCloseModal = () => {
    setEditModalVisible(false);
  };

  const handleEdit = async () => {
    const formValue: TProject = await editForm.validateFields();
    formValue.action = DOStatus.UPDATED;
    dispatch(
      updateProject({
        ...{ ...selectedNode, children: undefined, parent: undefined },
        ...formValue,
      }),
    );
    setEditModalVisible(false);
  };

  /**弹出删除确认框 */
  const handleToRemoveModal = () => {
    setRemoveModalVisible(true);
  };

  /**删除取消 */
  const handleRemoveCloseModal = () => {
    setRemoveModalVisible(false);
  };

  /**删除 */
  const handleRemove = async () => {
    dispatch(removeProject({ idProject: selectedNode?.id! }));
    setRemoveModalVisible(false);
  };

  return (
    <>
      <Space size={'middle'}>
        <Button size={'small'} onClick={handleToAdd} type={'default'}>
          <PlusCircleOutlined />
        </Button>
        <Button size={'small'} onClick={handleToEdit} type={'default'}>
          <EditOutlined />
        </Button>
        <Button size={'small'} onClick={handleToRemoveModal} type={'default'}>
          <DeleteOutlined />
        </Button>
      </Space>
      <Modal
        title="添加子项目"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAdd}
      >
        <Form form={form}>
          <Form.Item label="所属项目" name={'idProject'}>
            <Select disabled>
              <Select.Option value={selectedNode?.id!}>
                {selectedNode?.displayName}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="子项目显示名称" name={'displayName'}>
            <Input placeholder="请输入子项目显示名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑项目"
        open={editModalVisible}
        onCancel={handleEditCloseModal}
        onOk={handleEdit}
      >
        <Form form={editForm}>
          <Form.Item label="项目ID" name={'idProject'} hidden>
            <Input />
          </Form.Item>
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
            <Input placeholder="请输入项目名称" />
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
      <Modal
        title="删除项目确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将项目{' '}
          <b style={{ color: 'blue', fontSize: 16 }}>
            {selectedNode?.displayName}
          </b>{' '}
          删除?
        </p>
      </Modal>
    </>
  );
};

export default ProjectNodeAction;
