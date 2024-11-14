import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Form, Checkbox, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import {
  TDtoComputationAttribute,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  actions,
  selectCurentSelectType,
  selectCurrentDiagramContent,
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
        ?.dcAttributes?.filter(
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
  }, [currentDiagramContent]);

  const tableColumns: ProColumns<TDtoComputationAttribute>[] = useMemo(() => {
    const baseColumns: ProColumns<TDtoComputationAttribute>[] = [
      {
        title: '序号',
        dataIndex: 'sn',
        width: '50px',
        editable: false,
        render: (text, record, _, action) => {
          const eleLocal = elementLocalton(
            window.location.hash,
            record?.idDtoComputationAttribute!,
          );
          return <span id={eleLocal.substring(1)}>{record.sn}</span>;
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
            (attrData) =>
              attrData.idDtoComputationAttribute === config.recordKey,
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
            (attrData) =>
              attrData.idDtoComputationAttribute === config.recordKey,
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
        title: '字段描述',
        dataIndex: 'note',
        renderFormItem: (_schema, config) => {
          //从config.record获取不到经过renderFormItem的属性
          const attribute = attrDataSource.find(
            (attrData) =>
              attrData.idDtoComputationAttribute === config.recordKey,
          );
          return <AttriubteNoteInput {...attribute} />;
        },
      },
    ];

    const moreColumns: ProColumns<TDtoComputationAttribute>[] = [
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

  /**行上移 */
  const handleRowUp = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoComputationAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record: TDtoComputationAttribute = { ...entityAttr };
        dispatch(actions.attrComputationRowUp(record));
      }
    }
  };

  /**行下移 */
  const handleRowDown = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoComputationAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record: TDtoComputationAttribute = { ...entityAttr };
        dispatch(actions.attrComputationRowDown(record));
      }
    }
  };

  /**添加行 */
  const handleAddRow = () => {
    const newEntityAttr: TDtoComputationAttribute = {
      idDtoComputationAttribute: nanoid(),
      idDtoEntity: currentDiagramContent,
    };
    dispatch(actions.addComputationAttribute(newEntityAttr));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(
      newEntityAttr.idDtoComputationAttribute as React.Key,
    );
    if (attrDataSource && attrDataSource.length > 0) {
      const eleLocal = elementLocalton(
        window.location.hash,
        attrDataSource[attrDataSource.length - 1].idDtoComputationAttribute!,
      );
      window.location.href = eleLocal;
    }
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const idDtoComputationAttribute = editableKeys[0];
      const deleteAttr = attrDataSource.find(
        (attr) =>
          attr.action !== DOStatus.DELETED &&
          attr.idDtoComputationAttribute === idDtoComputationAttribute,
      );
      if (!deleteAttr) {
        return;
      }
      dispatch(actions.deleteComputationAttribute(deleteAttr));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TDtoComputationAttribute,
    dataSource: TDtoComputationAttribute[],
  ) => void = (
    record: TDtoComputationAttribute,
    dataSource: TDtoComputationAttribute[],
  ) => {
    const newAttribute = attrDataSource.find((entityAttr) => {
      return (
        entityAttr.idDtoComputationAttribute ===
        record.idDtoComputationAttribute
      );
    });
    //需要将特殊单元格得值合并过来
    dispatch(
      actions.updateComputationAttribute({
        ...record,
        attributeName: newAttribute?.attributeName,
        idAttributeType: newAttribute?.idAttributeType,
        attributeTypeName: newAttribute?.attributeTypeName,
        note: newAttribute?.note,
      }),
    );
  };
  /**行操作 */
  const handleRow = (record: TDtoComputationAttribute) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idDtoComputationAttribute!);
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
          onClick={handleDelete}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          删除
        </Button>
        <Button size={'small'} onClick={handleToggleColumns}>
          {brief ? '更多' : '简略'}
        </Button>
      </Space>
      <EditableProTable<TDtoComputationAttribute>
        style={{ padding: '0px' }}
        className={styles['my-ant-card-body']}
        actionRef={actionRef}
        rowKey={'idDtoComputationAttribute'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 160 }}
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
        onRow={handleRow}
      />
    </>
  );
};

export default AttrLayout;
