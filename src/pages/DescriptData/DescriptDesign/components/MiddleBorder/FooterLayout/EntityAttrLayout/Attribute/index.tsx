import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
  selectEntitys,
  fetchEntityAttributes,
  selectSysDataTypes,
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
import AttributeNameInput from './AttributeNameInput';
import AttriubteNoteInput from './AttriubteNoteInput';
import styles from '../../index.less';
import AddCommonAttributes from './AddCommonAttributes';
import { elementLocalton } from '@/util';
import ColumnNameInput from './ColumnNameInput';

const AttrLayout: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const idEntity = useSelector(selectCurrentDiagramContent);
  const currentType = useSelector(selectCurentSelectType);
  const moduleUi = useSelector(selectModuleUi);
  const [brief, setBrief] = useState<boolean>(true);
  const entities = useSelector(selectEntitys);
  const dataTypes = useSelector(selectSysDataTypes);
  const attrDataSource = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return [];
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return (
      state[moduleName].entityCollection.entities
        ?.find((entityFind) => entityFind.idEntity === idElement)
        ?.attributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  useEffect(() => {
    if (currentType !== EnumConcreteDiagramType.ENTITY) {
      return;
    }
    const idElement = idEntity;
    if (idEntity !== idElement) {
      setEditableRowKeys([]);
    }
    const findEntity = entities?.find(
      (entity) =>
        entity.idEntity === idElement &&
        entity.action !== DOStatus.NEW &&
        entity.action !== DOStatus.DELETED,
    );
    if (findEntity && (!attrDataSource || attrDataSource.length === 0)) {
      dispatch(fetchEntityAttributes([idElement!]));
    }
  }, [idEntity]);

  const baseColumns: ProColumns<TAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      render: (text, record, _, action) => {
        const eleLocal = elementLocalton(
          window.location.hash,
          record?.idAttribute!,
        );
        return <span id={eleLocal.substring(1)}>{record.sn}</span>;
      },
    },
    {
      title: 'P',
      dataIndex: 'fgPrimaryKey',
      // editable: false,
      width: '50px',
      valueType: 'checkbox',
      formItemProps: { valuePropName: 'checked' },
      renderFormItem: (_schema, config) => {
        return <Checkbox />;
      },
      render: (text, record, _, action) => {
        return record.fgPrimaryKey ? '是' : '否';
      },
    },
    {
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
      title: 'Name',
      dataIndex: 'displayName',
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
      renderFormItem: (_schema, config) => {
        //从config.record获取不到经过renderFormItem的属性
        const attribute = attrDataSource.find(
          (attrData) => attrData.idAttribute === config.recordKey,
        );
        return <ColumnNameInput {...attribute} />;
      },
      render: (_dom, record) => {
        return record?.columnName;
      },
    },
    {
      title: () => {
        return (
          // <span style={{ textDecorationLine: 'line-through' }}>
          //   {'属性名称'}
          // </span>
          '属性名称'
        );
      },
      dataIndex: 'attributeName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      renderFormItem: (_schema, config) => {
        //从config.record获取不到经过renderFormItem的属性
        const attribute = attrDataSource.find(
          (attrData) => attrData.idAttribute === config.recordKey,
        );
        return <AttributeNameInput {...attribute} />;
      },
      render: (_dom, record) => {
        return (
          // <span style={{ textDecorationLine: 'line-through' }}>
          //   {record?.attributeName}
          // </span>
          record?.attributeName
        );
      },
    },
    {
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
        const attributeType = dataTypes.find((dataType) => {
          return record.idAttributeType === dataType.idDataType;
        });
        return <>{attributeType?.displayName}</>;
      },
    },
    {
      title: '字段描述',
      dataIndex: 'note',
      renderFormItem: (_schema, config) => {
        //从config.record获取不到经过renderFormItem的属性
        const attribute = attrDataSource.find(
          (attrData) => attrData.idAttribute === config.recordKey,
        );
        return <AttriubteNoteInput {...attribute} />;
      },
    },
  ];

  const moreColumns: ProColumns<TAttribute>[] = [
    {
      title: '长度',
      dataIndex: 'len',
      renderFormItem: (_schema, config) => {
        return <InputNumber />;
      },
    },
    {
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

  /**行上移 */
  const handleRowUp = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.attrRowUp(record));
      }
    }
  };

  /**行下移 */
  const handleRowDown = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.attrRowDown(record));
      }
    }
  };

  /**添加行 */
  const handleAddRow = () => {
    const newEntityAttr: TAttribute = {
      idAttribute: nanoid(),
      idEntity: idEntity,
    };
    dispatch(actions.addAttribute(newEntityAttr));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newEntityAttr.idAttribute as React.Key);
    if (attrDataSource && attrDataSource.length > 0) {
      window.location.href =
        '#/devmanager/descriptdata#' +
        attrDataSource[attrDataSource.length - 1].idAttribute;
    }
  };
  /**从表信息添加主键 */
  const handleAddKey = () => {
    dispatch(actions.addKeyAttribute(idEntity!));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(idEntity as React.Key);
    if (attrDataSource && attrDataSource.length > 0) {
      const eleLocal = elementLocalton(
        window.location.hash,
        attrDataSource[attrDataSource.length - 1].idAttribute!,
      );
      window.location.href = eleLocal;
    }
  };

  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const idAttribute = editableKeys[0];
      const deleteAttr = attrDataSource.find(
        (attr) =>
          attr.action !== DOStatus.DELETED && attr.idAttribute === idAttribute,
      );
      if (!deleteAttr) {
        return;
      }
      dispatch(actions.deleteAttribute(deleteAttr));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TAttribute,
    dataSource: TAttribute[],
  ) => void = (record: TAttribute, dataSource: TAttribute[]) => {
    const newAttribute = attrDataSource.find((entityAttr) => {
      return entityAttr.idAttribute === record.idAttribute;
    });
    //需要将特殊单元格得值合并过来
    dispatch(
      actions.updateAttribute({
        ...record,
        columnName: newAttribute?.columnName,
        attributeName: newAttribute?.attributeName,
        idAttributeType: newAttribute?.idAttributeType,
        attributeTypeName: newAttribute?.attributeTypeName,
        note: newAttribute?.note,
      }),
    );
  };
  /**行操作 */
  const handleRow = (record: TAttribute) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idAttribute!);
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
      <Space size={10} style={{ marginBottom: '5px' }}>
        <Button size={'small'} onClick={handleAddRow} icon={<PlusOutlined />}>
          添加
        </Button>
        <Button size={'small'} onClick={handleAddKey} icon={<PlusOutlined />}>
          主键生成
        </Button>
        <AddCommonAttributes />
        <Button
          size={'small'}
          onClick={handleRowUp}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          上移
        </Button>
        <Button
          size={'small'}
          onClick={handleRowDown}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          下移
        </Button>
        <Button
          size={'small'}
          onClick={handleDelete}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          删除
        </Button>
        <Button size={'small'} onClick={handleToggleColumns}>
          {brief ? '更多' : '简略'}
        </Button>
        <span>
          总共
          <span style={{ color: 'blue', margin: '0px 5px', fontSize: '18px' }}>
            {attrDataSource?.length ?? 0}
          </span>
          条目
        </span>
      </Space>
      <EditableProTable<TAttribute>
        className={styles['my-ant-card-body']}
        actionRef={actionRef}
        rowKey={'idAttribute'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 200 }}
        maxLength={5}
        recordCreatorProps={false}
        value={attrDataSource}
        columns={brief ? [...baseColumns] : [...baseColumns, ...moreColumns]}
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
