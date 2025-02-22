import { Tabs, Modal, Form, Input, message, Select } from 'antd';
import { FC, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormDropBox from './FormDropBox';
import TableDropBox, { TTableDropBoxProps } from './TableDropBox';
import { EPartName, TBillFormTab } from '@/pages/Factory/Units/Form/model';
import { actions, selectMetaData } from '@/pages/Factory/Units/Form/store';
import { firstToLower, firstToUpper } from '@/util/name-convent';
import { useFormBillformTabs } from '../../../store/hooks';
import { TDescriptionInfo } from '@/pages/Factory/Units/common/model';
import { useFgLoadData } from '../../../hooks';
import { nanoid } from '@reduxjs/toolkit';

export type TPanelTabsProps = {
  name: EPartName;
};

const PanelTabs: FC<TPanelTabsProps> = ({ name }) => {
  const [form] = Form.useForm<TBillFormTab>();
  const { TabPane } = Tabs;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tabPanes, setTabPanes] = useState<ReactNode[]>();
  const dispatch = useDispatch();
  const [metadataOptions, setMetadataOptions] = useState<ReactNode[]>();

  const [activeKey, setActiveKey] = useState<string>();
  const billFormTabs = useFormBillformTabs(name);
  const treeDatas = useSelector(selectMetaData);
  const fgLoadData = useFgLoadData();

  useEffect(() => {
    if (treeDatas && treeDatas.length > 0) {
      let newOps: ReactNode[] = [];
      if (name === EPartName.Body) {
        treeDatas[0].children?.forEach((attr) => {
          if (attr.children && attr.children.length > 0 && attr.fgPartner) {
            newOps.push(
              <Select.Option key={attr.id} value={attr.id}>
                {attr.attributeName}
              </Select.Option>,
            );
          }
        });
      } else {
        newOps.push(
          <Select.Option key={treeDatas[0].id} value={treeDatas[0].id}>
            {treeDatas[0].attributeName}
          </Select.Option>,
        );
      }
      setMetadataOptions(newOps);
    }
  }, [treeDatas]);

  useEffect(() => {
    let newTabPanes: ReactNode[] = [];
    billFormTabs?.forEach((billformT) => {
      const dragBoxTarget: TTableDropBoxProps = {
        partName: name,
        billformT: billformT,
      };
      newTabPanes.push(
        <TabPane
          key={billformT.idBillFormTab}
          tab={billformT.tabName}
          tabKey={billformT.tabCode}
          closable={true}
        >
          {name === EPartName.Body ? (
            <TableDropBox {...dragBoxTarget} />
          ) : (
            <FormDropBox {...dragBoxTarget} />
          )}
        </TabPane>,
      );
    });
    setTabPanes(newTabPanes);
  }, [billFormTabs]);

  const handleMetaChange = (idAttr?: string) => {
    if (!idAttr) {
      return;
    }
    if (treeDatas && treeDatas.length > 0) {
      let md: TDescriptionInfo | undefined = undefined;
      if (name === EPartName.Body) {
        treeDatas[0].children?.forEach((attr) => {
          if (
            attr.children &&
            attr.children.length > 0 &&
            attr.fgPartner &&
            idAttr === attr.id
          ) {
            md = attr;
          }
        });
      } else {
        md = treeDatas[0];
      }
      if (md) {
        const values: TBillFormTab = form.getFieldsValue();
        const newvalues: TBillFormTab = {
          ...values,
          metadataAttrName: md.id,
          tabCode: md.attributeName,
          firstUpperTabCode: firstToUpper(md.attributeName!),
          tabName: md.displayName,
          tabAttrName: md.attributeName,
          firstUpperTabAttrName: firstToUpper(md.attributeName!),
          tabClassName: md.entityInfo?.className,
          firstLowerTabClassName: firstToLower(md.entityInfo?.className!),
          mainProperty: md.entityInfo?.pkAttributeInfo?.attributeName!,
          orderInfoList: [
            {
              idOrderInfo: nanoid(),
              orderProperty: md.entityInfo?.pkAttributeInfo?.attributeName!,
              orderType: 'ASC',
            },
          ],
          orderProperty: md.entityInfo?.pkAttributeInfo?.attributeName!,
          orderType: 'ASC',
          refType:
            md.attributeTypeCode === 'InternalArray' ? 'Array' : 'Single',
        };
        form.setFieldsValue(newvalues);
      }
    }
  };

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    }

    if (action === 'remove') {
      remove(targetKey);
    }
  };

  const add = () => {
    showModal();
  };

  const remove = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
  ) => {
    dispatch(
      actions.removeBillFormTab({ name, idBillFormTab: targetKey as string }),
    );
  };

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    dispatch(actions.addBillFormTab({ name, billFormTab: values }));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        style={{
          display: fgLoadData ? 'flex' : 'none',
          flex: 'auto',
          overflow: 'auto',
        }}
      >
        {tabPanes}
      </Tabs>
      <Modal
        title="标签页信息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="tab"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item label="元数据" name="idAttribute">
            <Select onChange={handleMetaChange} allowClear>
              {metadataOptions}
            </Select>
          </Form.Item>
          <Form.Item
            label="元数据类名"
            name="tabClassName"
            rules={[{ required: true, message: 'Please input tabClassName!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="驼峰类名"
            name="firstLowerTabClassName"
            rules={[
              {
                required: true,
                message: 'Please input firstLowerTabClassName!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="元数据属性名"
            name="tabAttrName"
            rules={[{ required: true, message: 'Please input tabAttrName!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="首字母大写属性名"
            name="firstUpperTabAttrName"
            rules={[
              {
                required: true,
                message: 'Please input firstUpperTabAttrName!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="主属性"
            name="mainProperty"
            rules={[{ required: true, message: 'Please input mainProperty!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="排序属性"
            name="orderProperty"
            rules={[{ required: true, message: 'Please input orderProperty!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="orderType">
            <Select defaultValue={'ASC'}>
              <Select.Option value={'ASC'}>ASC</Select.Option>
              <Select.Option value={'DESC'}>DESC</Select.Option>
            </Select>
          </Form.Item>
          {name === EPartName.Body ? (
            <Form.Item label="引用类型" name="refType">
              <Select defaultValue={'Array'}>
                <Select.Option value={'Single'}>Single</Select.Option>
                <Select.Option value={'Array'}>Array</Select.Option>
              </Select>
            </Form.Item>
          ) : undefined}
          <Form.Item
            label="标签页编码"
            name="tabCode"
            rules={[{ required: true, message: 'Please input tabCode!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="首字母大写编码"
            name="firstUpperTabCode"
            rules={[
              { required: true, message: 'Please input firstUpperTabCode!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="标签页名称"
            name="tabName"
            rules={[{ required: true, message: 'Please input tabName!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={'复数类型'} name={'refType'}>
            <Select
              placeholder={'请选择'}
              dropdownStyle={{ minWidth: '100px' }}
            >
              <Select.Option value={'Single'}>Single</Select.Option>
              <Select.Option value={'Array'}>Array</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PanelTabs;
