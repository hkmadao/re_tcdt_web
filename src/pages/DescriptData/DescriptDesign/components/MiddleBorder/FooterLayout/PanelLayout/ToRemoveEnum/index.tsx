import { Button, Input, InputRef, Popover, Table, TableColumnType } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import {
  TEnum,
  TEnumAttribute,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  actions,
  fetchEntityAttributes,
} from '@/pages/DescriptData/DescriptDesign/store';
import { useDispatch } from 'react-redux';
import {
  useIdCollection,
  useLoadStatus,
  useModuleUi,
  useCollection,
  useHasDeleteFlagEnums,
} from '@/pages/DescriptData/DescriptDesign/hooks';
import { DOStatus } from '@/models';

const ToRemoveEnum: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useModuleUi();
  const [enumTableKeys, setEnumTableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [attrs, setAttrs] = useState<TEnumAttribute[]>([]);
  const { typeColumns, attrColumns } = useColumns();
  const hasDeleteFlagEnums = useHasDeleteFlagEnums();
  const loadStatus = useLoadStatus();
  const idCollection = useIdCollection();
  const collection = useCollection();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    setEnumTableRowKeys([]);
    setAttrEditableRowKeys([]);
    setAttrs([]);
    setSearchValue(undefined);
  }, [idCollection]);

  const filterEntities = useMemo(() => {
    const filterEntities = hasDeleteFlagEnums.filter((entity) => {
      if (!searchValue) {
        return true;
      }
      if (
        entity.className?.includes(searchValue) ||
        entity.displayName?.includes(searchValue)
      ) {
        return true;
      }
      return false;
    });
    return filterEntities;
  }, [hasDeleteFlagEnums]);

  const handleChange = (e: any) => {
    const searchValue = e.currentTarget.value;
    setSearchValue(searchValue);
    setEnumTableRowKeys([]);
  };

  useEffect(() => {
    setAttrEditableRowKeys([]);
  }, [enumTableKeys]);

  useEffect(() => {
    const childAttrs =
      filterEntities.find((m) => enumTableKeys.includes(m.idEnum))
        ?.attributes ?? [];
    setAttrs(childAttrs.filter((attr) => attr.action === DOStatus.DELETED));
  }, [enumTableKeys, attrEditableKeys, loadStatus, collection]);

  /**恢复删除实体 */
  const handleEntityRestore = () => {
    const reStoreEnum = filterEntities.find((entity) =>
      enumTableKeys.includes(entity.idEnum!),
    );
    if (reStoreEnum) {
      dispatch(actions.recoverEnum(reStoreEnum));
    }
    setEnumTableRowKeys([]);
    setSearchValue(undefined);
  };

  /**行操作 */
  const handleRow = (record: TEnum) => {
    return {
      onClick: async (_event: any) => {
        setEnumTableRowKeys([record.idEnum!]);
        if (record && (!record.attributes || record.attributes.length === 0)) {
          dispatch(fetchEntityAttributes([record.idEnum!]));
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
      attrEditableKeys.includes(attr.idEnumAttribute!),
    );

    if (updateAttributes) {
      const notExistsAttr = attrs.length === updateAttributes.length;
      dispatch(actions.recoverEnumAttributes(updateAttributes));
      if (notExistsAttr) {
        setEnumTableRowKeys([]);
      }
      setAttrEditableRowKeys([]);
    }
  };

  /**行操作 */
  const handleAttrRow = (record: TEnumAttribute) => {
    return {
      onClick: async (_event: any) => {
        if (attrEditableKeys.includes(record.idEnumAttribute!)) {
          setAttrEditableRowKeys(
            attrEditableKeys.filter((id) => id !== record.idEnumAttribute),
          );
          return;
        }
        setAttrEditableRowKeys([...attrEditableKeys, record.idEnumAttribute!]);
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
                {hasDeleteFlagEnums?.length ?? 0}
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
          <Table<TEnum>
            className={styles['my-ant-pro-table']}
            rowKey={'idEnum'}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
            dataSource={filterEntities}
            columns={typeColumns}
            onRow={handleRow}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: enumTableKeys,
              onChange(selectedRowKeys, selectedRows, info) {
                setEnumTableRowKeys(selectedRowKeys);
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
          <Table<TEnumAttribute>
            className={styles['my-ant-pro-table']}
            rowKey={'idEnumAttribute'}
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

export default ToRemoveEnum;

const useColumns = () => {
  const typeColumns: TableColumnType<TEnum>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'idEnum',
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
      title: '显示名称',
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

  const attrColumns: TableColumnType<TEnumAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      render: (text, record) => {
        return <span>{record.sn}</span>;
      },
    },
    {
      title: '编号',
      dataIndex: 'code',
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
      title: '显示名称',
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

  return { typeColumns, attrColumns };
};
