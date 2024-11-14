import { FC, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { TSubProject, TSimpleEntityCollection } from '../../../models';
import { DOStatus } from '@/models';
import { addCollection, removeModule, updateModule } from '../../../store';
import { useSelectedNode } from '../../../hooks';

const SubProjectAction: FC = () => {
  const [form] = Form.useForm<TSimpleEntityCollection>();
  const [editForm] = Form.useForm<TSubProject>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const selectedNode = useSelectedNode();
  const dispatch = useDispatch();

  const handleToAdd = () => {
    form.resetFields();
    const entityCollection = {
      idSubProject: selectedNode?.id,
    };
    form.setFieldsValue(entityCollection);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const entityCollection: TSimpleEntityCollection =
      await form.validateFields();
    entityCollection.action = DOStatus.NEW;
    dispatch(addCollection(entityCollection));
    setModalVisible(false);
  };

  const handleToEdit = () => {
    editForm.resetFields();
    editForm.setFieldsValue({
      ...selectedNode,
      idSubProject: selectedNode?.id,
      idProject: selectedNode?.idParent,
    });
    setEditModalVisible(true);
  };

  const handleEditCloseModal = () => {
    setEditModalVisible(false);
  };

  const handleEdit = async () => {
    const formValue: TSubProject = await editForm.validateFields();
    formValue.action = DOStatus.UPDATED;
    dispatch(
      updateModule({
        ...{ ...selectedNode, children: undefined, parent: undefined },
        ...formValue,
        idSubProject: selectedNode?.id,
        idProject: selectedNode?.idParent,
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
      removeModule({
        ...selectedNode,
        idSubProject: selectedNode?.id,
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
        title="添加实体集"
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
          <Form.Item label="实体集显示名称" name={'displayName'}>
            <Input placeholder="请输入方案显示名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑子项目"
        open={editModalVisible}
        onCancel={handleEditCloseModal}
        onOk={handleEdit}
      >
        <Form form={editForm}>
          <Form.Item label="子项目ID" name={'idSubProject'} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="子项目显示名称" name={'displayName'}>
            <Input placeholder="请输入子项目名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="删除子项目确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将子项目{' '}
          <b style={{ color: 'blue', fontSize: 16 }}>
            {selectedNode?.displayName}
          </b>{' '}
          删除?
        </p>
      </Modal>
    </>
  );
};

export default SubProjectAction;
