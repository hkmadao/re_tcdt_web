import { Button, Input, InputRef, message, Popover } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  selectSysDataTypes,
  actions,
  fetchEntityAttributes,
} from '@/pages/DescriptData/DescriptDesign/store';
import { useDispatch, useSelector } from 'react-redux';
import AttributeTypeSelect from './AttributeTypeSelect';
import {
  useIdCollection,
  useLoadStatus,
  useNotDeleteEntities,
} from '@/pages/DescriptData/DescriptDesign/hooks';
import { DOStatus } from '@/models';

const EntitiesEditTable: FC = () => {
  const dispatch = useDispatch();
  const actionRef = useRef<ActionType>();
  const attrActionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [attrs, setAttrs] = useState<TAttribute[]>([]);
  const { typeColumns, attrColumns } = useColumns();
  const notDeleteEntities = useNotDeleteEntities();
  const loadStatus = useLoadStatus();
  const idCollection = useIdCollection();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    setEditableRowKeys([]);
    setAttrEditableRowKeys([]);
    setAttrs([]);
    setSearchValue(undefined);
  }, [idCollection]);

  const filterEntities = useMemo(() => {
    const filterEntities = notDeleteEntities.filter((entity) => {
      if (!searchValue) {
        return true;
      }
      if (
        entity.tableName?.includes(searchValue) ||
        entity.className?.includes(searchValue) ||
        entity.displayName?.includes(searchValue)
      ) {
        return true;
      }
      return false;
    });
    return filterEntities;
  }, [notDeleteEntities]);

  const handleChange = (e: any) => {
    const searchValue = e.currentTarget.value;
    setSearchValue(searchValue);
    setEditableRowKeys([]);
  };

  useEffect(() => {
    setAttrEditableRowKeys([]);
  }, [editableKeys]);

  useEffect(() => {
    const childAttrs =
      filterEntities.find((m) => editableKeys.includes(m.idEntity))
        ?.attributes ?? [];
    setAttrs(childAttrs.filter((attr) => attr.action !== DOStatus.DELETED));
  }, [editableKeys, attrEditableKeys, loadStatus]);

  /**添加行 */
  const handleAddRow = () => {
    const newEntity: TEntity = {
      idEntity: nanoid(),
      tableName: 'new_table' + (notDeleteEntities.length + 1),
      className: 'NewTable' + (notDeleteEntities.length + 1),
      displayName: 'NewTable' + (notDeleteEntities.length + 1),
      attributes: [],
    };
    dispatch(actions.addEntity(newEntity));
    setSearchValue(undefined);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newEntity.idEntity as React.Key);
  };

  /**编辑行内容改变处理 */
  const handleFormChange: (record: TEntity, dataSource: TEntity[]) => void = (
    record: TEntity,
    dataSource: TEntity[],
  ) => {
    dispatch(actions.updateEntity(record));
  };
  /**行操作 */
  const handleRow = (record: TEntity) => {
    return {
      onClick: async (_event: any) => {
        if (record && (!record.attributes || record.attributes.length === 0)) {
          dispatch(fetchEntityAttributes([record.idEntity!]));
        }
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
    const findEntity = filterEntities.find((entity) =>
      editableKeys.includes(entity.idEntity),
    );
    if (!findEntity) {
      message.error('找不到实体');
    }
    const newAttr: TAttribute = {
      idEntity: findEntity?.idEntity,
      idAttribute: nanoid(),
      columnName: 'column_name' + (attrs.length + 1),
      attributeName: 'attributeName' + (attrs.length + 1),
      displayName: 'displayName' + (attrs.length + 1),
      idAttributeType: '',
      fgPrimaryKey: false,
    };

    dispatch(actions.addAttribute(newAttr));
    attrEditableKeys.forEach((editableKey) =>
      attrActionRef.current?.cancelEditable(editableKey),
    );
    attrActionRef.current?.startEditable(newAttr.idAttribute as React.Key);
  };

  const handleSetToPk = () => {
    const updateAttribute = attrs.find((attr) =>
      attrEditableKeys.includes(attr.idAttribute!),
    );

    if (updateAttribute) {
      dispatch(
        actions.updateAttribute({ ...updateAttribute, fgPrimaryKey: true }),
      );
    }
  };

  /**删除行 */
  const handleAttrDelete = () => {
    if (attrEditableKeys && attrEditableKeys.length === 1) {
      const deleteAttribute = attrs.find((attr) =>
        attrEditableKeys.includes(attr.idAttribute!),
      );
      if (deleteAttribute) {
        dispatch(actions.deleteAttribute(deleteAttribute));
        setAttrEditableRowKeys([]);
      }
    }
  };
  /**编辑行内容改变处理 */
  const handleAttrFormChange: (
    record: TAttribute,
    dataSource: TAttribute[],
  ) => void = (record: TAttribute, dataSource: TAttribute[]) => {
    dispatch(actions.updateAttribute(record));
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
      <div>
        <div
          style={{
            height: '400px',
            display: 'flex',
            overflow: 'auto',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <Button
                onClick={handleAddRow}
                size={'small'}
                type={'primary'}
                disabled={!idCollection}
              >
                添加
              </Button>
              <span>
                总共
                <span
                  style={{
                    color: 'blue',
                    margin: '0px 5px',
                    fontSize: '18px',
                  }}
                >
                  {notDeleteEntities?.length ?? 0}
                </span>
                条目，
              </span>
              <span>
                筛选出
                <span
                  style={{
                    color: 'blue',
                    margin: '0px 5px',
                    fontSize: '18px',
                  }}
                >
                  {filterEntities.length ?? 0}
                </span>
                条目
              </span>
              <Input
                ref={searchRef}
                value={searchValue}
                size={'small'}
                style={{ width: '200px', marginLeft: '10px' }}
                placeholder="请输入过虑条件"
                onChange={handleChange}
              />
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
              value={filterEntities}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <Button
                onClick={handleAttrAddRow}
                size={'small'}
                type={'primary'}
                disabled={editableKeys.length !== 1}
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
                disabled={attrEditableKeys.length !== 1}
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
      </div>
    </>
  );
};

export default EntitiesEditTable;

const useColumns = () => {
  const dispatch = useDispatch();
  const sysDataTypes = useSelector(selectSysDataTypes);
  const notDeleteEntities = useNotDeleteEntities();

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
      dataIndex: 'idEntity',
      title: 'ID',
      editable: false,
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => dispatch(actions.updateGoToId(content))}
              >
                {content}
              </span>
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
        const findAttr = notDeleteEntities
          .find((entity) => entity.idEntity === config.record?.idEntity)
          ?.attributes?.find(
            (attr) =>
              attr.action !== DOStatus.DELETED &&
              attr.idAttribute === config.record?.idAttribute,
          );
        return findAttr?.fgPrimaryKey ? '是' : '否';
      },
      render: (text, record, _, action) => {
        const findAttr = notDeleteEntities
          .find((entity) => entity.idEntity === record?.idEntity)
          ?.attributes?.find(
            (attr) =>
              attr.action !== DOStatus.DELETED &&
              attr.idAttribute === record?.idAttribute,
          );
        return findAttr?.fgPrimaryKey ? '是' : '否';
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
