import { Button, Collapse, Form, Input, Modal, Select, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TBillFormContent,
  TBillFormUriConf,
  TTableBillFormUriConf,
} from '@/pages/Factory/Units/Form/model';
import { actions, selectModuleData } from '@/pages/Factory/Units/Form/store';
import { useEditUriConf, useViewUriConf } from '../../../../store/hooks';
import { PicCenterOutlined } from '@ant-design/icons';
import { getBillFormUriConf, getTableBillFormUriConf } from '../../../../util';

const { Panel } = Collapse;

const BillFormBase: FC = () => {
  const [form] = Form.useForm<TBillFormContent>();
  const [uiConfViewForm] = Form.useForm<TTableBillFormUriConf>();
  const [uiConfEditForm] = Form.useForm<TBillFormUriConf>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const billForm = useSelector(selectModuleData);
  const viewUriConf = useViewUriConf();
  const editUriConf = useEditUriConf();
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
    uiConfViewForm.resetFields();
    if (viewUriConf) {
      uiConfViewForm.setFieldsValue({
        ...viewUriConf,
      });
    }
    uiConfEditForm.resetFields();
    if (editUriConf) {
      uiConfEditForm.setFieldsValue({
        ...editUriConf,
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
    dispatch(actions.updateBaseBillForm(values));

    const viewFormValues = await uiConfViewForm.validateFields();
    dispatch(actions.updateViewUriConf(viewFormValues));

    const editFormValues = await uiConfEditForm.validateFields();
    dispatch(actions.updateEditUriConf(editFormValues));

    setModalVisible(false);
  };

  const handleUiConfViewForm = () => {
    if (billForm.metaData) {
      const className = billForm.metaData.entityInfo?.className;
      if (className) {
        const conf: TTableBillFormUriConf = getTableBillFormUriConf(
          className,
          billForm.billFormType ?? 'Single',
        );
        uiConfViewForm.resetFields();
        uiConfViewForm.setFieldsValue(conf);
      }
    }
  };

  const handleUiConfForm = () => {
    const className = billForm.metaData?.entityInfo?.className;
    if (className) {
      const conf: TBillFormUriConf = getBillFormUriConf(
        className,
        billForm.billFormType ?? 'Single',
      );
      uiConfEditForm.resetFields();
      uiConfEditForm.setFieldsValue(conf);
    }
  };

  return (
    <>
      <span>
        <Button
          type={'text'}
          onClick={handleToConfig}
          disabled={!billForm.idBillForm}
          size={'middle'}
          icon={
            <Tooltip overlay={'表单基本信息'}>
              <PicCenterOutlined />
            </Tooltip>
          }
        ></Button>
      </span>
      <Modal
        title="表单基本信息"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOk}
        width={'600px'}
      >
        <div style={{ height: '400px', overflow: 'auto' }}>
          <Collapse
            defaultActiveKey={['base', 'uiConfViewForm', 'uiConfEditForm']}
          >
            <Panel header="表单基本信息" key="base">
              <Form
                form={form}
                name="billform"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
              >
                <Form.Item label="组件" name="componentName">
                  <Input readOnly={true} />
                </Form.Item>
                <Form.Item
                  label="表单名称"
                  name="name"
                  rules={[{ required: true, message: 'Please input name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="表单显示名称"
                  name="displayName"
                  rules={[
                    { required: true, message: 'Please input displayName!' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label={'表单类型'} name={'billFormType'}>
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value={'Single'}>单组件</Select.Option>
                    <Select.Option value={'Combination'}>
                      组合组件
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            </Panel>
            <Panel header="列表URI配置" key="uiConfViewForm">
              <Form
                form={uiConfViewForm}
                name="uiConfViewForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
              >
                <Form.Item label="列表" name="page">
                  <Input />
                </Form.Item>
                <Form.Item label="根据ID获取详情" name="fetchById">
                  <Input />
                </Form.Item>
                <Form.Item label="批量删除" name="batchRemove">
                  <Input />
                </Form.Item>
                <div
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <Button
                    disabled={!billForm.metaData?.entityInfo?.className}
                    onClick={handleUiConfViewForm}
                  >
                    从元数据生成
                  </Button>
                </div>
              </Form>
            </Panel>
            <Panel header="编辑URI配置" key="uiConfEditForm">
              <Form
                form={uiConfEditForm}
                name="uiConfEditForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
              >
                <Form.Item label="根据ID获取详情" name="fetchById">
                  <Input />
                </Form.Item>
                <Form.Item label="添加" name="save">
                  <Input />
                </Form.Item>
                <Form.Item label="更新" name="update">
                  <Input />
                </Form.Item>
                <Form.Item label="删除" name="dataRemove">
                  <Input />
                </Form.Item>
                <div
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <Button
                    disabled={!billForm.metaData?.entityInfo?.className}
                    onClick={handleUiConfForm}
                  >
                    从元数据生成
                  </Button>
                </div>
              </Form>
            </Panel>
          </Collapse>
        </div>
      </Modal>
    </>
  );
};

export default BillFormBase;
