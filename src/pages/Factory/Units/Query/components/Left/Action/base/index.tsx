import { Button, Form, Input, Modal, Select, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TQueryContent } from '@/pages/Factory/Units/Query/model';
import { actions, selectModuleData } from '@/pages/Factory/Units/Query/store';
import { PicCenterOutlined } from '@ant-design/icons';

const BillFormBase: FC = () => {
  const [form] = Form.useForm<TQueryContent>();
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
    dispatch(actions.updateBaseQueryTemplate(values));
    setModalVisible(false);
  };

  return (
    <>
      <span>
        <Tooltip overlay={'查询模板基本信息'}>
          <Button
            type={'text'}
            onClick={handleToConfig}
            disabled={!billForm.idQuery}
            size={'middle'}
            icon={<PicCenterOutlined />}
          ></Button>
        </Tooltip>
      </span>
      <Modal
        title="查询模板基本信息"
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
            <Form.Item label="项目id" name="idProject" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="子项目id" name="idSubProject" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="组件模块id" name="idComponentModule" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="组件id" name="idComponent" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="组件" name="componentName">
              <Input />
            </Form.Item>
            <Form.Item label="查询模板id" name="idQuery" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="查询模板名称"
              name="name"
              rules={[{ required: true, message: 'Please input name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="查询模板显示名称"
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
