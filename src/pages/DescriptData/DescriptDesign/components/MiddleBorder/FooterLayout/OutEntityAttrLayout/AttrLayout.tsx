import { FC, useEffect, useRef, useState } from 'react';
import { Button, Space, Form, Checkbox, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import {
  TAttribute,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  actions,
  selectCurentSelectType,
  selectCurrentDiagramContent,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { nanoid } from '@reduxjs/toolkit';
import AttributeTypeSelect from './AttributeTypeSelect';
import { fetchOutEntityAttribute } from '@/pages/DescriptData/DescriptDesign/store/fetch-entity-attribute';

const AttrLayout: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const currentType = useSelector(selectCurentSelectType);
  const moduleUi = useSelector(selectModuleUi);
  const [idEntity, setIdEntity] = useState<string>();
  const [brief, setBrief] = useState<boolean>(true);

  const attrDataSource = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.OUT_ENTITY
    ) {
      return [];
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return (
      state[moduleName].entityCollection.outEntities
        ?.find((entityFind) => entityFind.idEntity === idElement)
        ?.attributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  useEffect(() => {
    if (currentType !== EnumConcreteDiagramType.OUT_ENTITY) {
      return;
    }
    const idElement = currentDiagramContent;
    if (idEntity !== idElement) {
      setEditableRowKeys([]);
    }
    setIdEntity(idElement);
    if (!attrDataSource || attrDataSource.length === 0) {
      dispatch(fetchOutEntityAttribute(idElement!));
    }
  }, [currentDiagramContent]);

  const attrColumns: ProColumns<TAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      renderFormItem: (_schema, config) => {
        return <InputNumber />;
      },
    },
    {
      title: 'P',
      dataIndex: 'fgPrimaryKey',
      editable: false,
      width: '50px',
      render: (text, record, _, action) => [
        <>{record.fgPrimaryKey ? '是' : ''}</>,
      ],
    },
    {
      editable: false,
      title: 'M',
      dataIndex: 'fgMandatory',
      width: '50px',
      valueType: 'checkbox',
      formItemProps: { valuePropName: 'checked' },
      renderFormItem: (_schema, config) => {
        return <Checkbox />;
      },
      render: (text, record, _, action) => {
        return record.fgMandatory ? '是' : '否';
      },
    },
    {
      editable: false,
      title: 'Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      editable: false,
      title: 'Code',
      dataIndex: 'columnName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '属性名称（待删除）',
      dataIndex: 'attributeName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      editable: false,
      title: '数据类型',
      dataIndex: 'idAttributeType',
      // valueType: 'select',
      renderFormItem: (_schema, config) => {
        //从config.record获取不到经过renderFormItem的属性
        const attribute = attrDataSource.find(
          (attrData) => attrData.idAttribute === config.recordKey,
        );
        // if (
        //   config.record?.category === 'Children' ||
        //   config.record?.category === 'Parent'
        // ) {
        //   return <AttributeTypePickerInput {...attribute} />;
        // }
        return <AttributeTypeSelect {...attribute} />;
      },
      render: (_dom, record) => {
        if (record.attributeTypeName) {
          return <>{record.attributeTypeName}</>;
        }
        return <>{record?.attributeType?.displayName}</>;
      },
    },
    {
      editable: false,
      title: '字段描述',
      dataIndex: 'note',
    },
    {
      editable: false,
      title: '长度',
      dataIndex: 'len',
      renderFormItem: (_schema, config) => {
        return <InputNumber />;
      },
    },
    {
      editable: false,
      title: '精度',
      dataIndex: 'pcs',
      renderFormItem: (_schema, config) => {
        return <InputNumber />;
      },
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
    },
  ];

  const briefColumns: ProColumns<TAttribute>[] = [
    {
      editable: false,
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      renderFormItem: (_schema, config) => {
        return <InputNumber />;
      },
    },
    {
      editable: false,
      title: 'P',
      dataIndex: 'fgPrimaryKey',
      width: '50px',
      render: (text, record, _, action) => [
        <>{record.fgPrimaryKey ? '是' : ''}</>,
      ],
    },
    {
      editable: false,
      title: 'M',
      dataIndex: 'fgMandatory',
      width: '50px',
      valueType: 'checkbox',
      formItemProps: { valuePropName: 'checked' },
      renderFormItem: (_schema, config) => {
        return <Checkbox />;
      },
      render: (text, record, _, action) => {
        return record.fgMandatory ? '是' : '否';
      },
    },
    {
      editable: false,
      title: 'Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      editable: false,
      title: 'Code',
      dataIndex: 'columnName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '属性名称（待删除）',
      dataIndex: 'attributeName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      editable: false,
      title: '数据类型',
      dataIndex: 'idAttributeType',
      // valueType: 'select',
      renderFormItem: (_schema, config) => {
        //从config.record获取不到经过renderFormItem的属性
        const attribute = attrDataSource.find(
          (attrData) => attrData.idAttribute === config.recordKey,
        );
        // if (
        //   config.record?.category === 'Children' ||
        //   config.record?.category === 'Parent'
        // ) {
        //   return <AttributeTypePickerInput {...attribute} />;
        // }
        return <AttributeTypeSelect {...attribute} />;
      },
      render: (_dom, record) => {
        if (record.attributeTypeName) {
          return <>{record.attributeTypeName}</>;
        }
        return <>{record?.attributeType?.displayName}</>;
      },
    },
    {
      editable: false,
      title: '字段描述',
      dataIndex: 'note',
    },
  ];

  /**设为主键 */
  const handleSetKey = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        record.fgPrimaryKey = true;
        dispatch(actions.updateAttribute(record));
      }
    }
  };

  /**添加行 */
  const handleAddRow = () => {
    const newEntityAttr: TAttribute = {
      idAttribute: nanoid(),
    };
    dispatch(actions.addAttribute(newEntityAttr));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newEntityAttr.idAttribute as React.Key);
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      dispatch(actions.deleteAttribute(editableKeys[0]));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TAttribute,
    dataSource: TAttribute[],
  ) => void = (record: TAttribute, dataSource: TAttribute[]) => {
    if (record.fgPrimaryKey) {
      const newDataSource: TAttribute[] = dataSource.map((entityAttr) => {
        if (entityAttr.idAttribute !== record.idAttribute) {
          entityAttr.fgPrimaryKey = false;
        }
        return entityAttr;
      });
    }
    dispatch(actions.updateAttribute(record));
  };
  /**行操作 */
  const handleRow = (record: TAttribute) => {
    return {
      onClick: async (_event: any) => {
        // editableKeys.forEach((editableKey) =>
        //   actionRef.current?.cancelEditable(editableKey),
        // );
        // actionRef.current?.startEditable(record.idAttribute!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**切换显示字段 */
  const handleToggleColumns = () => {
    setBrief(!brief);
  };

  return (
    <>
      <Space size={2}>
        <Button size={'small'} icon={<PlusOutlined />} disabled>
          添加
        </Button>
        <Button size={'small'} disabled>
          上移
        </Button>
        <Button size={'small'} disabled>
          下移
        </Button>
        <Button size={'small'} disabled>
          设为主键
        </Button>
        <Button size={'small'} disabled>
          删除
        </Button>
        <Button size={'small'} onClick={handleToggleColumns}>
          {brief ? '更多' : '简略'}
        </Button>
      </Space>
      <EditableProTable<TAttribute>
        style={{ padding: '0px' }}
        actionRef={actionRef}
        rowKey={'idAttribute'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        maxLength={5}
        recordCreatorProps={false}
        value={attrDataSource}
        columns={brief ? briefColumns : attrColumns}
        editable={{
          type: 'multiple',
          form,
          editableKeys,
          onChange: setEditableRowKeys,
          onValuesChange: handleFormChange,
        }}
        onRow={handleRow}
      />
    </>
  );
};

export default AttrLayout;
