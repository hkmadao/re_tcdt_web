import { Button, Form, Input, InputRef, Modal, Space } from 'antd';
import { FC, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TAction } from '../../../../model';
import ModuleAPI from '../../../../api';
import { SearchOutlined } from '@ant-design/icons';
import SubProjectRef from '@/pages/Factory/common/ref/subprojectree';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';

type TSubProject = {
  idProject?: string;
  projectName?: string;
  idSubProject?: string;
  subProjectName?: string;
};

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
  const [form] = Form.useForm<TAction>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [detailBillForm, setDetailBillForm] = useState<TAction>();
  const [subProject, setSubProject] = useState<TSubProject>();

  const searchRef = useRef<InputRef>(null);

  const onSearch = () => {
    searchCallBack(undefined, searchRef.current?.input?.value);
  };

  /**点击添加查询模板弹窗 */
  const handleToAddBillform = () => {
    if (compUpTreeInfo) {
      form.resetFields();
      form.setFieldValue('idSubProject', compUpTreeInfo.idSubProject);
      form.setFieldValue('subProjectName', compUpTreeInfo.subProjectName);
    }
    setModalVisible(true);
  };
  /**点击关闭添加查询模板弹窗 */
  const handleAddBillformCancel = () => {
    form.resetFields();
    const addBillFrom: Partial<TAction> = {};
    form.setFieldsValue(addBillFrom);
    setSubProject(undefined);
    setModalVisible(false);
  };

  /**打开编辑查询模板 */
  const handleToEditBillform = async () => {
    form.resetFields();
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const id = selectedRowKeys[0];
      const billForm: Partial<TAction> = await ModuleAPI.getById(id as string);
      setDetailBillForm(billForm);
      setSubProject({
        idProject: billForm.idProject,
        projectName: billForm.projectName,
        idSubProject: billForm.idSubProject,
        subProjectName: billForm.subProjectName,
      });
      form.setFieldsValue(billForm);
    }
    setModalVisible(true);
  };

  /**确认保存查询模板 */
  const handleSaveBillformOk = async () => {
    const billForm = await form.validateFields();
    if (billForm.idButtonAction) {
      //编辑
      const saveBillForm = await ModuleAPI.updateAction({
        ...detailBillForm,
        ...billForm,
        idProject: subProject?.idProject,
        projectName: billForm.projectName,
        idSubProject: subProject?.idSubProject,
        subProjectName: subProject?.subProjectName,
      });
    } else {
      const saveBillForm = await ModuleAPI.addAction({
        ...billForm,
        idProject: subProject?.idProject,
        projectName: billForm.projectName,
        idSubProject: subProject?.idSubProject,
        subProjectName: subProject?.subProjectName,
      });
    }

    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
    setModalVisible(false);
  };

  /**确认删除查询模板 */
  const handleDeleteBillformOk = async () => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idButtonAction = selectedRowKeys[0];
      const billForm: TAction = await ModuleAPI.getById(
        idButtonAction as string,
      );
      await ModuleAPI.deleteAction(billForm);
    }
    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
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
          disabled={!compUpTreeInfo?.idSubProject}
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
          disabled={!!compUpTreeInfo?.idSubProject}
          size={'small'}
          ref={searchRef}
        />
        <Button
          size={'small'}
          onBlur={onSearch}
          onClick={onSearch}
          disabled={!!compUpTreeInfo?.idSubProject}
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
          <Form.Item label="子项目" name="subProjectName">
            <SubProjectRef {...subProject} okCallback={setSubProject} />
          </Form.Item>
          <Form.Item label="idButtonAction" name="idButtonAction" hidden>
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
      </Modal>
    </>
  );
};

export default BillfromTable;
