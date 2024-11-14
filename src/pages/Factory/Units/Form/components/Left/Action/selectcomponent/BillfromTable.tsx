import {
  Button,
  Form,
  Input,
  InputRef,
  Modal,
  Select,
  Space,
  Spin,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TBillForm } from '@/pages/Factory/Units/Form/model';
import API from '../../../../api';
import { SearchOutlined } from '@ant-design/icons';
import { firstToUpper } from '@/util/name-convent';
import ComponentRef from '@/pages/Factory/common/ref/componenttree';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';

const BillfromTable: FC<{
  compUpTreeInfo?: TCompUpTreeInfo;
  selectedRowKeys: React.Key[];
  handleConfBillform: () => void;
  searchCallBack: (
    compUpTreeInfo: TCompUpTreeInfo | undefined,
    search?: string,
  ) => void;
}> = ({
  compUpTreeInfo,
  selectedRowKeys,
  handleConfBillform,
  searchCallBack,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [form] = Form.useForm<TBillForm>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [detailBillForm, setDetailBillForm] = useState<TBillForm>();

  const searchRef = useRef<InputRef>(null);

  const onSearch = () => {
    searchCallBack(undefined, searchRef.current?.input?.value);
  };

  /**点击添加表单弹窗 */
  const handleToAddBillform = () => {
    if (compUpTreeInfo) {
      form.resetFields();
      form.setFieldValue('idComponent', compUpTreeInfo.idComponent);
      form.setFieldValue('componentName', compUpTreeInfo.compDisplayName);
      form.setFieldValue(
        'name',
        compUpTreeInfo.componentName
          ? firstToUpper(compUpTreeInfo.componentName)
          : undefined,
      );
      form.setFieldValue('displayName', compUpTreeInfo.compDisplayName);
      form.setFieldValue(
        'billFormType',
        compUpTreeInfo.componentType === 'Combination'
          ? 'Combination'
          : 'Single',
      );
    }
    setModalVisible(true);
  };

  /**点击关闭添加表单弹窗 */
  const handleAddBillformCancel = () => {
    setModalVisible(false);
  };

  /**打开编辑表单 */
  const handleToEditBillform = async () => {
    setModalVisible(true);
    setSpinning(true);
    form.resetFields();
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idBillForm = selectedRowKeys[0];
      setSpinning(true);
      const billForm: TBillForm = await API.getById(idBillForm as string);
      setSpinning(false);
      setDetailBillForm(billForm);
      form.setFieldsValue(billForm);
    }
    setSpinning(false);
  };

  /**确认保存表单 */
  const handleSaveBillformOk = async () => {
    const billForm = await form.validateFields();
    const toSaveData: TBillForm = {
      ...billForm,
    };
    if (billForm.idBillForm) {
      //编辑
      const saveBillForm = await API.updateBillForm({
        ...detailBillForm,
        ...compUpTreeInfo,
        ...toSaveData,
      });
    } else {
      const saveBillForm = await API.addBillForm({
        ...compUpTreeInfo,
        ...toSaveData,
      });
    }

    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
    setModalVisible(false);
  };

  /**确认删除表单 */
  const handleDeleteBillformOk = async () => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idBillForm = selectedRowKeys[0];
      const billForm: TBillForm = await API.getById(idBillForm as string);
      await API.deleteBillForm(billForm);
    }
    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
  };

  /**点击组件 */
  const handleTreeClick = (nodeData: TCompUpTreeInfo) => {
    return () => {
      const newBillForm: TBillForm = {};
      newBillForm.idComponent = nodeData.idComponent;
      newBillForm.componentName = nodeData.componentName;
      newBillForm.billFormType = nodeData.componentType;
      newBillForm.name = nodeData.componentName;
      newBillForm.displayName = nodeData.compDisplayName;
      form.setFieldsValue(newBillForm);
    };
  };

  return (
    <>
      <Space size={2}>
        <Button
          type={'primary'}
          size={'small'}
          onClick={handleConfBillform}
          disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
        >
          配置
        </Button>
        <Button
          type={'primary'}
          size={'small'}
          onClick={handleToAddBillform}
          disabled={!compUpTreeInfo?.idComponent}
        >
          新建
        </Button>
        <Button
          type={'primary'}
          size={'small'}
          onClick={handleToEditBillform}
          disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
        >
          编辑
        </Button>
        <Button
          type={'primary'}
          size={'small'}
          onClick={handleDeleteBillformOk}
          disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
        >
          删除
        </Button>
        <Input
          disabled={!!compUpTreeInfo?.idComponent}
          size={'small'}
          ref={searchRef}
        />
        <Button
          size={'small'}
          onClick={onSearch}
          disabled={!!compUpTreeInfo?.idComponent}
          type={'primary'}
        >
          <SearchOutlined />
        </Button>
      </Space>
      <Modal
        title="添加表单"
        open={modalVisible}
        onOk={handleSaveBillformOk}
        onCancel={handleAddBillformCancel}
      >
        <Spin spinning={spinning}>
          <Form
            form={form}
            name="billform"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
          >
            <Form.Item label="组件id" name="idComponent" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="组件" name="componentName">
              <ComponentRef {...compUpTreeInfo} okCallback={handleTreeClick} />
            </Form.Item>
            <Form.Item label="表单id" name="idBillForm" hidden>
              <Input />
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
              rules={[{ required: true, message: 'Please input displayName!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={'表单类型'} name={'billFormType'} style={{}}>
              <Select placeholder="请选择" allowClear>
                <Select.Option value={'Single'}>单组件</Select.Option>
                <Select.Option value={'Combination'}>组合组件</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default BillfromTable;
