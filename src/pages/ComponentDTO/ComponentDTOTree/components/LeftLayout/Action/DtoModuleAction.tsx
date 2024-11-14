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
import {
  addCollection,
  removeDtoModule,
  updateDtoModule,
} from '../../../store';
import { TDtoModule, TSimpleDtoEntityCollection } from '../../../models';

const DtoModuleAction: FC = () => {
  const selectedNode = useSelectedNode();
  const [form] = Form.useForm<TSimpleDtoEntityCollection>();
  const [editForm] = Form.useForm<TDtoModule>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleToAdd = () => {
    form.resetFields();
    const entityCollection = {
      idDtoModule: selectedNode?.id,
    };
    form.setFieldsValue(entityCollection);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const dtoEntityCollection: TSimpleDtoEntityCollection =
      await form.validateFields();
    dtoEntityCollection.action = DOStatus.NEW;
    dispatch(addCollection(dtoEntityCollection));
    setModalVisible(false);
  };

  const handleToEdit = () => {
    editForm.resetFields();
    editForm.setFieldsValue({
      ...selectedNode,
      idDtoModule: selectedNode?.id,
      idSubProject: selectedNode?.idParent,
    });
    setEditModalVisible(true);
  };

  const handleEditCloseModal = () => {
    setEditModalVisible(false);
  };

  const handleEdit = async () => {
    const formValue: TDtoModule = await editForm.validateFields();
    formValue.action = DOStatus.UPDATED;
    dispatch(
      updateDtoModule({
        ...{ ...selectedNode, children: undefined, parent: undefined },
        ...formValue,
        idDtoModule: selectedNode?.id,
        idSubProject: selectedNode?.idParent,
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
    dispatch(
      removeDtoModule({
        ...selectedNode,
        idDtoModule: selectedNode?.id,
      }),
    );
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
        title="添加DTO集"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAdd}
      >
        <Form form={form}>
          <Form.Item label="所属DTO模块" name={'idDtoModule'}>
            <Select disabled>
              <Select.Option value={selectedNode?.id}>
                {selectedNode?.displayName}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="代码包名" name={'packageName'}>
            <Input placeholder="请输入代码包名" />
          </Form.Item>
          <Form.Item label="显示名称" name={'displayName'}>
            <Input placeholder="请输入显示名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑DTO模块"
        open={editModalVisible}
        onCancel={handleEditCloseModal}
        onOk={handleEdit}
      >
        <Form form={editForm}>
          <Form.Item label="DTO模块ID" name={'idDtoModule'} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="DTO模块包名" name={'path'}>
            <Input placeholder="请输入DTO模块包名" />
          </Form.Item>
          <Form.Item label="DTO模块显示名称" name={'displayName'}>
            <Input placeholder="请输入DTO模块名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="删除DTO模块确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将DTO模块{' '}
          <b style={{ color: 'blue', fontSize: 16 }}>
            {selectedNode?.displayName}
          </b>{' '}
          删除?
        </p>
      </Modal>
    </>
  );
};

export default DtoModuleAction;
