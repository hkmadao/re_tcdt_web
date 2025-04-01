import { Button, Input, InputRef, Popover, Table, TableColumnType } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  useIdCollection,
  useLoadStatus,
  useHasDeleteFlagEntities,
  useModuleUi,
} from '@/pages/DescriptData/DescriptDesign/hooks';
import { DOStatus } from '@/models';

const ToRemoveEntity: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useModuleUi();
  const [entityTableKeys, setEntityTableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [attrs, setAttrs] = useState<TAttribute[]>([]);
  const { typeColumns, attrColumns } = useColumns();
  const hasDeleteFlagEntities = useHasDeleteFlagEntities();
  const loadStatus = useLoadStatus();
  const idCollection = useIdCollection();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    setEntityTableRowKeys([]);
    setAttrEditableRowKeys([]);
    setAttrs([]);
    setSearchValue(undefined);
  }, [idCollection]);

  const filterEntities = useMemo(() => {
    const filterEntities = hasDeleteFlagEntities.filter((entity) => {
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
  }, [hasDeleteFlagEntities]);

  const handleChange = (e: any) => {
    const searchValue = e.currentTarget.value;
    setSearchValue(searchValue);
    setEntityTableRowKeys([]);
  };

  useEffect(() => {
    setAttrEditableRowKeys([]);
  }, [entityTableKeys]);

  useEffect(() => {
    const childAttrs =
      filterEntities.find((m) => entityTableKeys.includes(m.idEntity))
        ?.attributes ?? [];
    setAttrs(childAttrs.filter((attr) => attr.action === DOStatus.DELETED));
  }, [entityTableKeys, attrEditableKeys, loadStatus]);

  /**恢复删除实体 */
  const handleEntityRestore = () => {
    const reStoreEntity = filterEntities.find((entity) =>
      entityTableKeys.includes(entity.idEntity!),
    );
    if (reStoreEntity) {
      dispatch(actions.recoverEntity(reStoreEntity));
    }
    setEntityTableRowKeys([]);
    setSearchValue(undefined);
  };

  /**行操作 */
  const handleRow = (record: TEntity) => {
    return {
      onClick: async (_event: any) => {
        setEntityTableRowKeys([record.idEntity!]);
        if (record && (!record.attributes || record.attributes.length === 0)) {
          dispatch(fetchEntityAttributes([record.idEntity!]));
        }
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  const handleAttrRestore = () => {
    const updateAttributes = attrs.filter((attr) =>
      attrEditableKeys.includes(attr.idAttribute!),
    );

    if (updateAttributes) {
      const notExistsAttr = attrs.length === updateAttributes.length;
      dispatch(actions.recoverAttributes(updateAttributes));
      if (notExistsAttr) {
        setEntityTableRowKeys([]);
      }
      setAttrEditableRowKeys([]);
    }
  };

  /**行操作 */
  const handleAttrRow = (record: TAttribute) => {
    return {
      onClick: async (_event: any) => {
        if (attrEditableKeys.includes(record.idAttribute!)) {
          setAttrEditableRowKeys(
            attrEditableKeys.filter((id) => id !== record.idAttribute),
          );
          return;
        }
        setAttrEditableRowKeys([...attrEditableKeys, record.idAttribute!]);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          overflow: 'auto',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button
              onClick={handleEntityRestore}
              size={'small'}
              type={'primary'}
              disabled={!idCollection}
            >
              恢复
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
                {hasDeleteFlagEntities?.length ?? 0}
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
          <Table<TEntity>
            className={styles['my-ant-pro-table']}
            rowKey={'idEntity'}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
            dataSource={filterEntities}
            columns={typeColumns}
            onRow={handleRow}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: entityTableKeys,
              onChange(selectedRowKeys, selectedRows, info) {
                setEntityTableRowKeys(selectedRowKeys);
              },
            }}
            pagination={false}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button
              onClick={handleAttrRestore}
              size={'small'}
              type={'primary'}
              disabled={attrEditableKeys.length < 1}
            >
              恢复
            </Button>
          </div>
          <Table<TAttribute>
            className={styles['my-ant-pro-table']}
            rowKey={'idAttribute'}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
            dataSource={attrs}
            columns={attrColumns}
            onRow={handleAttrRow}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: attrEditableKeys,
              onChange(selectedRowKeys, selectedRows, info) {
                setAttrEditableRowKeys(selectedRowKeys);
              },
            }}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default ToRemoveEntity;

const useColumns = () => {
  const dispatch = useDispatch();
  const sysDataTypes = useSelector(selectSysDataTypes);
  const hasDeleteFlagEntities = useHasDeleteFlagEntities();

  const typeColumns: TableColumnType<TEntity>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'idEntity',
      title: 'ID',
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                // onClick={() => dispatch(actions.updateGoToId(content))}
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
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

  const attrColumns: TableColumnType<TAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      render: (text, record) => {
        return <span>{record.sn}</span>;
      },
    },
    {
      title: 'P',
      dataIndex: 'fgPrimaryKey',
      width: '50px',
      render: (text, record) => {
        const findAttr = hasDeleteFlagEntities
          .find((entity) => entity.idEntity === record?.idEntity)
          ?.attributes?.find(
            (attr) =>
              attr.action === DOStatus.DELETED &&
              attr.idAttribute === record?.idAttribute,
          );
        return findAttr?.fgPrimaryKey ? '是' : '否';
      },
    },
    {
      title: '字段名',
      dataIndex: 'columnName',
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
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
