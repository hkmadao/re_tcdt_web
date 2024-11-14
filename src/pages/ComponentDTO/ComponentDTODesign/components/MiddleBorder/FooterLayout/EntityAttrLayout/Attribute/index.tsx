import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Form, Checkbox, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import {
  TDtoEntityAttribute,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  actions,
  selectCurentSelectType,
  selectCurrentDiagramContent,
  selectEntitys,
  fetchEntityAttributes,
  selectSysDataTypes,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { nanoid } from '@reduxjs/toolkit';
import AttributeTypeSelect from './AttributeTypeSelect';
import AttributeNameInput from './AttributeNameInput';
import AttriubteNoteInput from './AttriubteNoteInput';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import styles from '../../index.less';
import { elementLocalton } from '@/util';
import ColumnNameInput from './ColumnNameInput';

const AttrLayout: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const currentType = useSelector(selectCurentSelectType);
  const moduleUi = useSelector(selectModuleUi);
  const [idDtoEntity, setIdEntity] = useState<string>();
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
      state[moduleName].dtoCollection.dtoEntities
        ?.find((entityFind) => entityFind.idDtoEntity === idElement)
        ?.deAttributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  useEffect(() => {
    if (currentType !== EnumConcreteDiagramType.ENTITY) {
      return;
    }
    const idElement = currentDiagramContent;
    if (idDtoEntity !== idElement) {
      setEditableRowKeys([]);
    }
    setIdEntity(idElement);
    const findEntity = entities?.find(
      (entity) =>
        entity.idDtoEntity === idElement &&
        entity.action !== DOStatus.NEW &&
        entity.action !== DOStatus.DELETED,
    );
    if (findEntity && (!attrDataSource || attrDataSource.length === 0)) {
      dispatch(fetchEntityAttributes([idElement!]));
    }
  }, [currentDiagramContent]);

  const tableColumns: ProColumns<TDtoEntityAttribute>[] = useMemo(() => {
    const baseColumns: ProColumns<TDtoEntityAttribute>[] = [
      {
        title: '序号',
        dataIndex: 'sn',
        width: '50px',
        editable: false,
        render: (text, record, _, action) => {
          const eleLocal = elementLocalton(
            window.location.hash,
            record?.idDtoEntityAttribute!,
          );
          return <span id={eleLocal.substring(1)}>{record.sn}</span>;
        },
      },
      {
        title: 'P',
        dataIndex: 'fgPrimaryKey',
        editable: false,
        width: '50px',
        render: (text, record, _, action) => {
          return <>{record.fgPrimaryKey ? '是' : ''}</>;
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
            (attrData) => attrData.idDtoEntityAttribute === config.recordKey,
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
            (attrData) => attrData.idDtoEntityAttribute === config.recordKey,
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
            (attrData) => attrData.idDtoEntityAttribute === config.recordKey,
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
            (attrData) => attrData.idDtoEntityAttribute === config.recordKey,
          );
          return <AttriubteNoteInput {...attribute} />;
        },
      },
    ];

    const moreColumns: ProColumns<TDtoEntityAttribute>[] = [
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
    return brief ? baseColumns : baseColumns.concat(moreColumns);
  }, [brief, attrDataSource]);

  /**设为主键 */
  const handleSetKey = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoEntityAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.setAttributePrimaryKey(record));
      }
    }
  };

  /**行上移 */
  const handleRowUp = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoEntityAttribute === editableKeys[0].toString(),
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
          entityAttr.idDtoEntityAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.attrRowDown(record));
      }
    }
  };

  /**添加行 */
  const handleAddRow = () => {
    const newEntityAttr: TDtoEntityAttribute = {
      idDtoEntityAttribute: nanoid(),
      idDtoEntity: currentDiagramContent,
    };
    dispatch(actions.addAttribute(newEntityAttr));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(
      newEntityAttr.idDtoEntityAttribute as React.Key,
    );
    if (attrDataSource && attrDataSource.length > 0) {
      const eleLocal = elementLocalton(
        window.location.hash,
        attrDataSource[attrDataSource.length - 1].idDtoEntityAttribute!,
      );
      window.location.href = eleLocal;
    }
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const idDtoEntityAttribute = editableKeys[0];
      const deleteAttr = attrDataSource.find(
        (attr) =>
          attr.action !== DOStatus.DELETED &&
          attr.idDtoEntityAttribute === idDtoEntityAttribute,
      );
      if (!deleteAttr) {
        return;
      }
      dispatch(actions.deleteAttribute(deleteAttr));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TDtoEntityAttribute,
    dataSource: TDtoEntityAttribute[],
  ) => void = (
    record: TDtoEntityAttribute,
    dataSource: TDtoEntityAttribute[],
  ) => {
    const newAttribute = attrDataSource.find((entityAttr) => {
      return entityAttr.idDtoEntityAttribute === record.idDtoEntityAttribute;
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
  const handleRow = (record: TDtoEntityAttribute) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idDtoEntityAttribute!);
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
        <Button size={'small'} onClick={handleAddRow} icon={<PlusOutlined />}>
          添加
        </Button>
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
          onClick={handleSetKey}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          设为主键
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
      </Space>
      <EditableProTable<TDtoEntityAttribute>
        style={{ padding: '0px' }}
        className={styles['my-ant-card-body']}
        actionRef={actionRef}
        rowKey={'idDtoEntityAttribute'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 200 }}
        maxLength={5}
        recordCreatorProps={false}
        value={attrDataSource}
        columns={tableColumns}
        editable={{
          type: 'multiple',
          form,
          editableKeys,
          onChange: setEditableRowKeys,
          onValuesChange: handleFormChange,
        }}
        pagination={{
          total: attrDataSource?.length,
          pageSize: attrDataSource?.length,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
        onRow={handleRow}
      />
    </>
  );
};

export default AttrLayout;
