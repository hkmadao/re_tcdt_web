import { Button, Form, Input, Modal, Select, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PicCenterOutlined } from '@ant-design/icons';
import { TTreeContent } from '../../../../model';
import { actions, selectModuleData } from '../../../../store';

const BillFormBase: FC = () => {
  const [form] = Form.useForm<TTreeContent>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const billForm = useSelector(selectModuleData);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  /**点击选择组件 */
  const handleToConfig = () => {
    form.resetFields();
    if (billForm) {
      form.setFieldsValue({
        ...billForm,
      });
    }
    setModalVisible(true);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认选中组件 */
  const handleOk = async () => {
    const values = await form.validateFields();
    dispatch(actions.updateBase(values));
    setModalVisible(false);
  };

  return (
    <>
      <span>
        <Tooltip overlay={'基本信息'}>
          <Button
            type={'text'}
            onClick={handleToConfig}
            disabled={!billForm.idTree}
            size={'middle'}
            icon={<PicCenterOutlined />}
          ></Button>
        </Tooltip>
      </span>
      <Modal
        title="基本信息"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOk}
        width={'600px'}
      >
        <div style={{ height: '400px', overflow: 'auto' }}>
          <Form
            form={form}
            name="billform"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
          >
            <Form.Item label="id" name="idFactory" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: 'Please input name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="显示名称"
              name="displayName"
              rules={[{ required: true, message: 'Please input displayName!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default BillFormBase;
