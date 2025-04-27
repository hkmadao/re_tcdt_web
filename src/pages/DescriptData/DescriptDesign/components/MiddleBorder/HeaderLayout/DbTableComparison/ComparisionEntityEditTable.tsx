import { Button, Collapse, message } from 'antd';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import styles from './index.less';
import {} from '@/pages/DescriptData/DescriptDesign/models';
import { selectSysDataTypes } from '@/pages/DescriptData/DescriptDesign/store';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import { useSelector, useDispatch } from 'react-redux';
import AttributeTypeSelect from './AttributeTypeSelect';
import { TComparisionAttrs, TComparisionEntity } from '.';

const ComparisionEntityEditTable: FC<{
  entitiesProps: TComparisionEntity[];
}> = ({ entitiesProps }) => {
  const { Panel } = Collapse;
  const actionRef = useRef<ActionType>();
  const attrActionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [attrs, setAttrs] = useState<TComparisionAttrs[]>([]);
  const [entities, setEntities] = useState<TComparisionEntity[]>([]);
  const { typeColumns, attrColumns } = useColumns();

  const dispatch = useDispatch();

  useEffect(() => {
    setEntities([...entitiesProps]);
  }, [entitiesProps]);

  useEffect(() => {
    const childAttrs =
      entities.find((m) => editableKeys.includes(m.idEntity))
        ?.comparisionAttrs ?? [];
    setAttrs(childAttrs);
  }, [editableKeys]);

  /**添加实体到集合 */
  const handleAdd = () => {
    const selectedEnti = entities.find((enti) =>
      editableKeys.includes(enti.idEntity),
    );
    if (!selectedEnti) {
      message.error('请先选中实体');
      return;
    }
    if (selectedEnti.fgExistsEntity) {
      message.error('实体已存在与集合中');
      return;
    }
    if (!selectedEnti.fgExistsEntity) {
      dispatch(actions.addEntity({ ...selectedEnti, alreadyExistsId: true }));
      selectedEnti.comparisionAttrs.forEach((attr) => {
        console.log({ ...attr });
        dispatch(actions.addAttribute({ ...attr }));
      });
      const newModels: TComparisionEntity[] = JSON.parse(
        JSON.stringify(entities),
      );
      const toSave = newModels.map((m) => {
        if (m.idEntity === selectedEnti.idEntity) {
          return {
            ...selectedEnti,
            comparisionAttrs: m.comparisionAttrs.map((attr) => {
              attr.fgExistsEntity = true;
              attr.fgSync = true;
              return attr;
            }),
            fgExistsEntity: true,
            fgSync: true,
          };
        }
        return {
          ...m,
        };
      });
      setEntities(toSave);
      const saveAfterEnti = newModels.find(
        (m) => m.idEntity === selectedEnti.idEntity,
      );
      const saveAfterAttrs = saveAfterEnti?.comparisionAttrs || [];
      setAttrs(saveAfterAttrs);
      message.success('添加成功');
    }
  };

  /**更新行 */
  const handleUpdate = () => {
    if (editableKeys && editableKeys.length === 1) {
      const selectedEnti = entities.find((m) =>
        editableKeys.includes(m.idEntity),
      );
      if (!selectedEnti?.fgExistsEntity) {
        message.error('请先添加实体到集合');
        return;
      }
      dispatch(actions.updateEntity({ ...selectedEnti }));
      message.success('更新成功');
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TComparisionEntity,
    dataSource: TComparisionEntity[],
  ) => void = (
    record: TComparisionEntity,
    dataSource: TComparisionEntity[],
  ) => {
    const newModels: TComparisionEntity[] = JSON.parse(
      JSON.stringify(entities),
    );
    const toSave = newModels.map((m) => {
      if (m.idEntity === record.idEntity) {
        return {
          ...record,
          comparisionAttrs: m.comparisionAttrs,
        };
      }
      return {
        ...m,
      };
    });
    setEntities(toSave);
  };
  /**行操作 */
  const handleRow = (record: TComparisionEntity) => {
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

  /**添加实体属性集合 */
  const handleAttrAdd = () => {
    const selectedAttr = attrs.find((attr) =>
      attrEditableKeys.includes(attr.idAttribute!),
    );
    if (!selectedAttr) {
      message.error('请先选中属性');
      return;
    }
    if (selectedAttr.fgExistsEntity) {
      message.error('属性已存在与集合中');
      return;
    }
    const entity = entities.find(
      (enti) => enti.idEntity === selectedAttr.idEntity && enti.fgExistsEntity,
    );
    if (!entity) {
      message.error('请先添加实体到集合');
      return;
    }
    if (!selectedAttr.fgExistsEntity) {
      dispatch(actions.addAttribute({ ...selectedAttr }));
    }
    const dataSource = attrs.map((attr) => {
      const newAttr: TComparisionAttrs = { ...attr };
      if (attr.idAttribute === selectedAttr.idAttribute) {
        newAttr.fgExistsEntity = true;
        newAttr.fgSync = true;
      }
      return newAttr;
    });
    setAttrs(dataSource);
    const newModels: TComparisionEntity[] = JSON.parse(
      JSON.stringify(entities),
    );
    newModels.forEach((m) => {
      if (m.idEntity === editableKeys[0]) {
        m.comparisionAttrs = dataSource;
      }
    });

    setEntities(newModels);
    message.success('添加成功');
  };

  /**更新行 */
  const handleAttrUpdate = () => {
    if (attrEditableKeys && attrEditableKeys.length === 1) {
      const selectedAttr = attrs.find((attr) =>
        attrEditableKeys.includes(attr.idAttribute!),
      );
      if (!selectedAttr?.fgExistsEntity) {
        message.error('请先添加属性到集合');
        return;
      }
      dispatch(actions.updateAttribute({ ...selectedAttr }));
      message.success('更新成功');
    }
  };
  /**编辑行内容改变处理 */
  const handleAttrFormChange: (
    record: TComparisionAttrs,
    dataSource: TComparisionAttrs[],
  ) => void = (record: TComparisionAttrs, dataSource: TComparisionAttrs[]) => {
    setAttrs(dataSource);
    const newModels: TComparisionEntity[] = JSON.parse(
      JSON.stringify(entities),
    );
    newModels.forEach((m) => {
      if (m.idEntity === editableKeys[0]) {
        m.comparisionAttrs = dataSource;
      }
    });

    setEntities(newModels);
  };
  /**行操作 */
  const handleAttrRow = (record: TComparisionAttrs) => {
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
        <Panel header="比较实体管理" key="model">
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
                <Button onClick={handleAdd} size={'small'} type={'primary'}>
                  添加
                </Button>
                <Button onClick={handleUpdate} size={'small'} type={'primary'}>
                  更新
                </Button>
              </div>
              <EditableProTable<TComparisionEntity>
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
                <Button onClick={handleAttrAdd} size={'small'} type={'primary'}>
                  添加
                </Button>
                <Button
                  onClick={handleAttrUpdate}
                  size={'small'}
                  type={'primary'}
                >
                  更新
                </Button>
              </div>
              <EditableProTable<TComparisionAttrs>
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
};

export default ComparisionEntityEditTable;

const useColumns = () => {
  const sysDataTypes = useSelector(selectSysDataTypes);

  const typeColumns: ProColumns<TComparisionEntity>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      render: (text, record, index, action) => {
        let flagNode: ReactNode = <></>;
        if (record.fgSync) {
          const existsNotSync = record.comparisionAttrs.find(
            (attr) => !attr.fgSync,
          );
          if (existsNotSync) {
            flagNode = <span style={{ color: 'red' }}>≠{index + 1}</span>;
          } else {
            flagNode = <span>={index + 1}</span>;
          }
        } else if (record.fgExistsEntity) {
          flagNode = <span style={{ color: 'green' }}>*{index + 1}</span>;
        } else if (record.fgExistsDb) {
          flagNode = <span style={{ color: 'red' }}>≠{index + 1}</span>;
        }
        return <>{flagNode}</>;
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

  const attrColumns: ProColumns<TComparisionAttrs>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      render: (text, record, index, action) => {
        let flagNode: ReactNode = <></>;
        if (record.fgSync) {
          flagNode = <span>={index + 1}</span>;
        } else if (record.fgExistsEntity) {
          flagNode = <span style={{ color: 'green' }}>*{index + 1}</span>;
        } else {
          flagNode = <span style={{ color: 'red' }}>≠{index + 1}</span>;
        }
        return <>{flagNode}</>;
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
      width: '150px',
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
      width: '150px',
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
      width: '150px',
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
      width: '150px',
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
