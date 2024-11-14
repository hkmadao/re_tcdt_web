import {
  Button,
  Form,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Space,
  message,
} from 'antd';
import { FC, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TLayout,
  TUiFactory,
  TUiFactoryContent,
} from '@/pages/Factory/Main/model';
import ModuleAPI from '../../../../api';
import { SearchOutlined } from '@ant-design/icons';
import ComponentRef from '@/pages/Factory/common/ref/componenttree';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';
import { firstToUpper } from '@/util';
import TemplateSelect from './TemplateSelect';

const cleanIdRef = (layouts: TLayout[]) => {
  if (!layouts) {
    return;
  }
  for (let i = 0; i < layouts.length; i++) {
    const l = layouts[i];
    if (l.children) {
      cleanIdRef(l.children);
    }
    if (l.component?.idRef) {
      l.component.idRef = undefined;
      l.component.name = undefined;
    }
  }
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
  const [form] = Form.useForm<
    TUiFactory & {
      actionType: 'add' | 'edit' | 'saveToTemplate' | 'addFromTemplate';
    }
  >();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [detailBillForm, setDetailBillForm] = useState<TUiFactory>();

  const searchRef = useRef<InputRef>(null);

  const onSearch = () => {
    searchCallBack(undefined, searchRef.current?.input?.value);
  };

  /**点击添加查询模板弹窗 */
  const handleToAddBillform = () => {
    if (compUpTreeInfo) {
      form.resetFields();
      form.setFieldValue('actionType', 'add');
      form.setFieldValue(
        'name',
        compUpTreeInfo.componentName
          ? firstToUpper(compUpTreeInfo.componentName)
          : undefined,
      );
      form.setFieldValue('idComponent', compUpTreeInfo.idComponent);
      form.setFieldValue('displayName', compUpTreeInfo.compDisplayName);
    }
    setModalVisible(true);
  };
  /**存为模板 */
  const handleSaveToTemplate = async () => {
    form.resetFields();
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idUiFactory = selectedRowKeys[0];
      const uiFactory: TUiFactory = await ModuleAPI.getById(
        idUiFactory as string,
      );
      if (!uiFactory.content) {
        message.error('模板内容为空！');
        return;
      }
      setDetailBillForm(uiFactory);
      form.setFieldsValue(uiFactory);
      form.setFieldValue('actionType', 'saveToTemplate');
    }
    setModalVisible(true);
  };
  /**从模板创建 */
  const handleAddFromTemplate = (template: TUiFactory) => {
    form.resetFields();
    if (!template.content) {
      message.error('模板内容为空！');
      return;
    }
    setDetailBillForm(template);
    form.setFieldsValue(template);
    form.setFieldValue('actionType', 'addFromTemplate');
    if (compUpTreeInfo) {
      form.setFieldValue(
        'name',
        compUpTreeInfo.componentName
          ? firstToUpper(compUpTreeInfo.componentName)
          : undefined,
      );
      form.setFieldValue('idComponent', compUpTreeInfo.idComponent);
      form.setFieldValue('displayName', compUpTreeInfo.compDisplayName);
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
      const billForm: TUiFactory = await ModuleAPI.getById(
        idBillForm as string,
      );
      setDetailBillForm(billForm);
      form.setFieldsValue(billForm);
      form.setFieldValue('actionType', 'edit');
    }
    setModalVisible(true);
  };

  /**确认保存查询模板 */
  const handleSaveBillformOk = async () => {
    const formData = await form.validateFields();
    if (formData.actionType === 'edit') {
      //编辑
      const saveAfter = await ModuleAPI.updateUiFactory({
        ...detailBillForm,
        ...formData,
        ...compUpTreeInfo,
      });
      message.info('更新成功！');
    }
    if (formData.actionType === 'add') {
      const saveAfter = await ModuleAPI.addUiFactory({
        ...formData,
        ...compUpTreeInfo,
      });
      message.info('添加成功！');
    }
    if (formData.actionType === 'saveToTemplate') {
      const template: TUiFactory = {
        ...detailBillForm,
        ...formData,
        ...compUpTreeInfo,
      };
      //删除模板无关属性
      template.refIdContent = undefined;
      template.fgTemplate = true;
      template.idComponent = undefined;
      template.componentName = undefined;
      template.componentModuleName = undefined;
      template.subProjectName = undefined;
      template.projectName = undefined;
      template.idComponentModule = undefined;
      template.idSubProject = undefined;
      template.idProject = undefined;
      const content: TUiFactoryContent = JSON.parse(template.content!);
      content.idComponent = undefined;
      content.fgTemplate = true;
      content.idComponent = undefined;
      content.idComponentModule = undefined;
      content.idSubProject = undefined;
      content.idProject = undefined;
      content.componentName = undefined;
      content.componentModuleName = undefined;
      content.subProjectName = undefined;
      content.projectName = undefined;
      content.name = formData.name;
      content.displayName = formData.displayName;
      const layouts = content.layouts ?? [];
      cleanIdRef(layouts);
      content.layouts = layouts;
      content.refIdContent = undefined;
      template.content = JSON.stringify(content);
      const saveAfter = await ModuleAPI.addUiFactory(template);
      message.info('保存模板成功！');
    }
    if (formData.actionType === 'addFromTemplate') {
      const template: TUiFactory = {
        ...detailBillForm,
        ...formData,
        ...compUpTreeInfo,
      };
      const content: TUiFactoryContent = JSON.parse(template.content!);
      content.name = formData.name;
      content.displayName = formData.displayName;
      const newContent = {
        ...content,
        ...compUpTreeInfo,
      };
      template.content = JSON.stringify(newContent);
      template.fgTemplate = false;
      const saveAfter = await ModuleAPI.addUiFactory(template);
      message.info('应用模板成功！');
    }

    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
    setModalVisible(false);
  };

  /**确认删除查询模板 */
  const handleDeleteBillformOk = async () => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const idBillForm = selectedRowKeys[0];
      const billForm: TUiFactory = await ModuleAPI.getById(
        idBillForm as string,
      );
      await ModuleAPI.deleteUiFactory(billForm);
      message.info('删除成功！');
    }
    searchCallBack(compUpTreeInfo, searchRef.current?.input?.value);
  };

  /**点击组件 */
  const handleTreeClick = (nodeData: TCompUpTreeInfo) => {
    return () => {
      const newBillForm: TUiFactory = {};
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
        <TemplateSelect
          onSelected={handleAddFromTemplate}
          disabled={!compUpTreeInfo?.idComponent}
        />
        <Button
          type={'primary'}
          size={'small'}
          onClick={handleSaveToTemplate}
          disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
        >
          存为模板
        </Button>
        <Button
          type={'primary'}
          size={'small'}
          onClick={handleToEditBillform}
          disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
        >
          编辑
        </Button>
        <Popconfirm
          placement="top"
          title={'确定删除提示'}
          onConfirm={handleDeleteBillformOk}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type={'primary'}
            size={'small'}
            disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
          >
            删除
          </Button>
        </Popconfirm>
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
        title="操作"
        open={modalVisible}
        onOk={handleSaveBillformOk}
        onCancel={handleAddBillformCancel}
      >
        <Form
          form={form}
          name="from"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item label="操作类型" name="actionType" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="组件id"
            name="idComponent"
            hidden={form.getFieldValue('actionType') === 'saveToTemplate'}
          >
            <ComponentRef {...compUpTreeInfo} okCallback={handleTreeClick} />
          </Form.Item>
          <Form.Item label="idFactory" name="idFactory" hidden>
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
