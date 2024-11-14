import { Button, Form, Input, Modal, Select, Tooltip, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PicCenterOutlined } from '@ant-design/icons';
import { TUiFactoryContent } from '@/pages/Factory/Main/model';
import { actions, selectModuleData } from '@/pages/Factory/Main/store';
import ModuleType from './ModuleType';
import { TModuleType } from '@/pages/Factory/common/model';

const BillFormBase: FC = () => {
  const [form] = Form.useForm<TUiFactoryContent>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const billForm = useSelector(selectModuleData);
  const [moduleTypes, setModuleTypes] = useState<TModuleType[]>([]);
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
    const errType = moduleTypes.find((m) => m.mainProperty === '');
    if (errType) {
      message.error(`类型[ ${errType.displayName} ]未设置主属性`);
      return;
    }
    const mainType = moduleTypes.find((m) => m.fgMain);
    const refTypes = moduleTypes.filter((m) => !m.fgMain);
    if (!mainType) {
      message.error('未设置主实体！');
      return;
    }
    dispatch(actions.updateModelTyps({ mainType, refTypes }));
    dispatch(actions.updateBaseMain(values));
    setModalVisible(false);
  };

  return (
    <>
      <span>
        <Tooltip overlay={'基本信息'}>
          <Button
            type={'text'}
            onClick={handleToConfig}
            disabled={!billForm.idFactory}
            size={'middle'}
            icon={<PicCenterOutlined />}
          ></Button>
        </Tooltip>
      </span>
      <Modal
        title="基本信息"
        open={modalVisible}
        onCancel={handleCloseModal}
        destroyOnClose={true}
        onOk={handleOk}
        width={'1000px'}
      >
        <div style={{ width: '500px', overflow: 'auto' }}>
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
        <ModuleType onResultChange={setModuleTypes} />
      </Modal>
    </>
  );
};

export default BillFormBase;
