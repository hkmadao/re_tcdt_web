import { Button, Collapse } from 'antd';
import {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { nanoid } from '@reduxjs/toolkit';
import styles from './index.less';
import {
  TEntity,
  TAttribute,
} from '@/pages/DescriptData/DescriptDesign/models';
import { selectSysDataTypes } from '@/pages/DescriptData/DescriptDesign/store';
import { useSelector } from 'react-redux';
import AttributeTypeSelect from './AttributeTypeSelect';

const ImportEntityEditTable: ForwardRefExoticComponent<
  PropsWithoutRef<{ entitiesProps: TEntity[] }> &
    RefAttributes<{ getEntities: () => TEntity[] }>
> = forwardRef(({ entitiesProps }, ref) => {
  const { Panel } = Collapse;
  const actionRef = useRef<ActionType>();
  const attrActionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [attrs, setAttrs] = useState<TAttribute[]>([]);
  const [entities, setEntities] = useState<TEntity[]>([]);
  const { typeColumns, attrColumns } = useColumns();

  useEffect(() => {
    if (!entitiesProps || entitiesProps.length === 0) {
      return;
    }
    const existsTableNames = entities
      .map((entity) => entity.tableName)
      .filter((tableName) => tableName && tableName.trim() !== '');
    const newEntities = entitiesProps.filter(
      (entity) =>
        entity.tableName &&
        entity.tableName.trim() !== '' &&
        !existsTableNames.includes(entity.tableName),
    );
    setEntities([...entities, ...newEntities]);
  }, [entitiesProps]);

  useImperativeHandle(
    ref,
    () => {
      const getEntities = () => {
        return entities;
      };
      return { getEntities };
    },
    [entities],
  );

  useEffect(() => {
    const childAttrs =
      entities.find((m) => editableKeys.includes(m.idEntity))?.attributes ?? [];
    setAttrs(childAttrs);
  }, [editableKeys]);

  /**添加行 */
  const handleAddRow = () => {
    const newType: TEntity = {
      idEntity: nanoid(),
      className: '',
      displayName: '',
      attributes: [],
    };
    const newTyps = [...entities, newType];
    setEntities(newTyps);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newType.idEntity as React.Key);
  };

  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const notDeletes = entities.filter(
        (m) => !editableKeys.includes(m.idEntity),
      );
      setEntities(notDeletes);
      setEditableRowKeys([]);
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (record: TEntity, dataSource: TEntity[]) => void = (
    record: TEntity,
    dataSource: TEntity[],
  ) => {
    const newModels: TEntity[] = JSON.parse(JSON.stringify(entities));
    const toSave = newModels.map((m) => {
      if (m.idEntity === record.idEntity) {
        return {
          ...record,
          attributes: m.attributes,
        };
      }
      return {
        ...m,
      };
    });
    setEntities(toSave);
  };
  /**行操作 */
  const handleRow = (record: TEntity) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idEntity);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAttrAddRow = () => {
    const newAttr: TAttribute = {
      idAttribute: nanoid(),
      attributeName: '',
      displayName: '',
      idAttributeType: '',
      fgPrimaryKey: false,
    };
    const newAttrs = [...attrs, newAttr];
    setAttrs(newAttrs);
    const newModels: TEntity[] = JSON.parse(JSON.stringify(entities));
    newModels.forEach((m) => {
      if (m.idEntity === editableKeys[0]) {
        m.attributes = newAttrs;
      }
    });
    setEntities(newModels);
    attrEditableKeys.forEach((editableKey) =>
      attrActionRef.current?.cancelEditable(editableKey),
    );
    attrActionRef.current?.startEditable(newAttr.idEntity as React.Key);
  };

  const handleSetToPk = () => {
    const newAttrs: TAttribute[] = JSON.parse(JSON.stringify(attrs));
    newAttrs.forEach((attr) => {
      if (attr.idAttribute === attrEditableKeys[0]) {
        attr.fgPrimaryKey = true;
        return;
      }
      attr.fgPrimaryKey = false;
    });
    setAttrs(newAttrs);
    const newModels: TEntity[] = JSON.parse(JSON.stringify(entities));
    newModels.forEach((m) => {
      if (m.idEntity === editableKeys[0]) {
        m.attributes = newAttrs;
      }
    });
    setEntities(newModels);
  };

  /**删除行 */
  const handleAttrDelete = () => {
    if (attrEditableKeys && attrEditableKeys.length === 1) {
      const notDeletes = attrs.filter(
        (attr) => !attrEditableKeys.includes(attr.idAttribute!),
      );
      setAttrs(notDeletes);
      const newModels: TEntity[] = JSON.parse(JSON.stringify(entities));
      newModels.forEach((m) => {
        if (m.idEntity === editableKeys[0]) {
          m.attributes = notDeletes;
        }
      });
      setEntities(newModels);
      setAttrEditableRowKeys([]);
    }
  };
  /**编辑行内容改变处理 */
  const handleAttrFormChange: (
    record: TAttribute,
    dataSource: TAttribute[],
  ) => void = (record: TAttribute, dataSource: TAttribute[]) => {
    setAttrs(dataSource);
    const newModels: TEntity[] = JSON.parse(JSON.stringify(entities));
    newModels.forEach((m) => {
      if (m.idEntity === editableKeys[0]) {
        m.attributes = dataSource;
      }
    });

    setEntities(newModels);
  };
  /**行操作 */
  const handleAttrRow = (record: TAttribute) => {
    return {
      onClick: async (_event: any) => {
        attrEditableKeys.forEach((editableKey) =>
          attrActionRef.current?.cancelEditable(editableKey),
        );
        attrActionRef.current?.startEditable(record.idAttribute!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  return (
    <>
      <Collapse defaultActiveKey={['model']}>
        <Panel header="导入实体管理" key="model">
          <div
            style={{
              height: '400px',
              display: 'flex',
              overflow: 'auto',
              gap: '10px',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button onClick={handleAddRow} size={'small'} type={'primary'}>
                  添加
                </Button>
                <Button onClick={handleDelete} size={'small'} type={'primary'}>
                  删除
                </Button>
              </div>
              <EditableProTable<TEntity>
                className={styles['my-ant-pro-table']}
                actionRef={actionRef}
                rowKey={'idEntity'}
                headerTitle={false}
                bordered={true}
                size={'small'}
                scroll={{ y: 300 }}
                maxLength={5}
                recordCreatorProps={false}
                value={entities}
                columns={typeColumns}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  onValuesChange: handleFormChange,
                }}
                onRow={handleRow}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button
                  onClick={handleAttrAddRow}
                  size={'small'}
                  type={'primary'}
                >
                  添加
                </Button>
                <Button
                  onClick={handleSetToPk}
                  size={'small'}
                  type={'primary'}
                  disabled={attrEditableKeys.length !== 1}
                >
                  设为主属性
                </Button>
                <Button
                  onClick={handleAttrDelete}
                  size={'small'}
                  type={'primary'}
                >
                  删除
                </Button>
              </div>
              <EditableProTable<TAttribute>
                className={styles['my-ant-pro-table']}
                actionRef={attrActionRef}
                rowKey={'idAttribute'}
                headerTitle={false}
                bordered={true}
                size={'small'}
                scroll={{ y: 300 }}
                maxLength={5}
                recordCreatorProps={false}
                value={attrs}
                columns={attrColumns}
                editable={{
                  type: 'multiple',
                  editableKeys: attrEditableKeys,
                  onChange: setAttrEditableRowKeys,
                  onValuesChange: handleAttrFormChange,
                }}
                onRow={handleAttrRow}
              />
            </div>
          </div>
        </Panel>
      </Collapse>
    </>
  );
});

export default ImportEntityEditTable;

const useColumns = () => {
  const sysDataTypes = useSelector(selectSysDataTypes);

  const typeColumns: ProColumns<TEntity>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      render: (text, record, index, action) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '表名',
      dataIndex: 'tableName',
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
      title: '类名',
      dataIndex: 'className',
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
      title: '类注释名',
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
  ];

  const attrColumns: ProColumns<TAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      render: (text, record, index, action) => {
        return <span>{record.sn}</span>;
      },
    },
    {
      title: 'P',
      dataIndex: 'fgPrimaryKey',
      width: '50px',
      editable: false,
      renderFormItem: (_schema, config) => {
        return config.record?.fgPrimaryKey ? '是' : '否';
      },
      render: (text, record, _, action) => {
        return record.fgPrimaryKey ? '是' : '否';
      },
    },
    {
      title: '字段名',
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
      title: '属性名',
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
      title: '属性显示名称名',
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
      title: '数据类型',
      dataIndex: 'idAttributeType',
      renderFormItem: (_schema, config) => {
        const record = config.record;
        const attributeType = sysDataTypes.find((dataType) => {
          return record?.idAttributeType === dataType.idDataType;
        });
        return <AttributeTypeSelect {...record} />;
      },
      render: (_dom, record) => {
        const attributeType = sysDataTypes.find((dataType) => {
          return record.idAttributeType === dataType.idDataType;
        });
        return <>{attributeType?.displayName}</>;
      },
    },
  ];

  return { typeColumns, attrColumns };
};
