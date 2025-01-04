import { FC, useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFgEdit, useSelectedNode } from '../../hooks';
import { addFile, removeFile, saveFileStat } from '../../store';
import { TTemplateFile } from '../../models';

const NodeAction: FC = () => {
  const distpatch = useDispatch();
  const fgEdit = useFgEdit();
  const selectedNode = useSelectedNode();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm<TTemplateFile>();

  const handleToAdd = () => {
    if (!selectedNode) {
      message.error('未选中节点');
      return;
    }
    form.resetFields();
    form.setFieldsValue({
      parentPathName: selectedNode.filePathName,
      fgFile: false,
    });
    setModalVisible(true);
  };

  const handleToEdit = () => {
    if (!selectedNode) {
      message.error('未选中节点');
      return;
    }
    form.resetFields();
    form.setFieldsValue({ ...selectedNode });
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (!selectedNode) {
      message.error('未选中节点');
      return;
    }
    distpatch(removeFile());
  };

  const handleCancelDelete = () => {};

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOk = async () => {
    const formValues = await form.validateFields();
    if (formValues.filePathName) {
      distpatch(saveFileStat(formValues));
    } else {
      distpatch(addFile(formValues));
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: '5px',
        }}
      >
        <Space size={'small'}>
          <Button
            size={'small'}
            onClick={handleToAdd}
            type={'default'}
            disabled={fgEdit || !selectedNode || selectedNode.fgFile}
          >
            <PlusCircleOutlined />
          </Button>
          <Button
            size={'small'}
            onClick={handleToEdit}
            type={'default'}
            disabled={fgEdit || !selectedNode || !selectedNode.idParent}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
            okText="确定"
            cancelText="取消"
            disabled={
              fgEdit ||
              !selectedNode ||
              selectedNode.children?.length !== 0 ||
              !selectedNode.idParent
            }
          >
            <Button
              size={'small'}
              type={'default'}
              disabled={
                fgEdit || !selectedNode || selectedNode.children?.length !== 0
              }
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      </div>
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOk}
        title="基本信息"
      >
        <div>
          <Form form={form} size="small">
            <Form.Item label="文件路径" name="filePathName" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="文件夹路径"
              name="parentPathName"
              rules={[
                { required: true, message: 'Please input parentPathName!' },
              ]}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="文件名称"
              name="fileName"
              rules={[{ required: true, message: 'Please input fileName!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="是否文件" name="fgFile">
              <Select>
                <Select.Option value={true}>是</Select.Option>
                <Select.Option value={false}>否</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default NodeAction;
