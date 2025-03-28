import { Button, Form, Input, InputRef, Modal, Space } from 'antd';
import { FC, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TQuery } from '@/pages/Factory/Units/Query/model';
import ModuleAPI from '../../../../api';
import { SearchOutlined } from '@ant-design/icons';
import { firstToUpper } from '@/util/name-convent';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';
import ComponentRef from '@/pages/Factory/common/ref/componenttree';

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
  const [form] = Form.useForm<TQuery>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [detailBillForm, setDetailBillForm] = useState<TQuery>();
  const searchRef = useRef<InputRef>(null);

  const onSearch = () => {
    searchCallBack(undefined, searchRef.current?.input?.value);
  };

  /**点击添加查询模板弹窗 */
  const handleToAddBillform = () => {
    if (compUpTreeInfo) {
      form.resetFields();
      form.setFieldValue(
        'name',
        compUpTreeInfo.componentName
          ? firstToUpper(compUpTreeInfo.componentName)
          : undefined,
      );
      form.setFieldValue('idComponent', compUpTreeInfo.idComponent);
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

  /**点击关闭添加查询模板弹窗 */
  const handleAddBillformCancel = () => {
    setModalVisible(false);
  };

  /**打开编辑查询模板 */
  const handleToEditBillform = async () => {
    form.resetFields();
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idBillForm = selectedRowKeys[0];
      const billForm: TQuery = await ModuleAPI.getById(idBillForm as string);
      setDetailBillForm(billForm);
      form.setFieldsValue(billForm);
    }
    setModalVisible(true);
  };

  /**确认保存查询模板 */
  const handleSaveBillformOk = async () => {
    const billForm = await form.validateFields();
    const toSaveData: TQuery = {
      ...billForm,
    };
    if (billForm.idQuery) {
      //编辑
      const saveBillForm = await ModuleAPI.updateBillForm({
        ...detailBillForm,
        ...compUpTreeInfo,
        ...toSaveData,
      });
    } else {
      const saveBillForm = await ModuleAPI.addBillForm({
        ...compUpTreeInfo,
        ...toSaveData,
      });
    }

    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
    setModalVisible(false);
  };

  /**确认删除查询模板 */
  const handleDeleteBillformOk = async () => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idBillForm = selectedRowKeys[0];
      const billForm: TQuery = await ModuleAPI.getById(idBillForm as string);
      await ModuleAPI.deleteBillForm(billForm);
    }
    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
  };

  /**点击组件 */
  const handleTreeClick = (nodeData: TCompUpTreeInfo) => {
    return () => {
      const newBillForm: TQuery = {};
      newBillForm.idComponent = nodeData.idComponent;
      newBillForm.componentName = nodeData.componentName;
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
        title="添加查询模板"
        open={modalVisible}
        onOk={handleSaveBillformOk}
        onCancel={handleAddBillformCancel}
      >
        <Form
          form={form}
          name="billform"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item label="组件id" name="idComponent">
            <ComponentRef {...compUpTreeInfo} okCallback={handleTreeClick} />
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
      </Modal>
    </>
  );
};

export default BillfromTable;
