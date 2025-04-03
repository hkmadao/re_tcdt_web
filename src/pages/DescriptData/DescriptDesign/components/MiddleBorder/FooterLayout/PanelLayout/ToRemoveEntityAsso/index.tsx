import { Button, Input, InputRef, Popover, Table, TableColumnType } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import { TEntityAssociate } from '@/pages/DescriptData/DescriptDesign/models';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  useIdCollection,
  useModuleUi,
  useHasDeleteFLagEntityAsso,
  useAllEntities,
} from '@/pages/DescriptData/DescriptDesign/hooks';

const ToRemoveEntityAsso: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useModuleUi();
  const [entityTableKeys, setEntityTableRowKeys] = useState<React.Key[]>([]);
  const { typeColumns } = useColumns();
  const hasDeleteFlagEntityAssos = useHasDeleteFLagEntityAsso();
  const idCollection = useIdCollection();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    setEntityTableRowKeys([]);
    setSearchValue(undefined);
  }, [idCollection]);

  const filterEntityAssos = useMemo(() => {
    const filterEntityAssos = hasDeleteFlagEntityAssos.filter((asso) => {
      if (!searchValue) {
        return true;
      }
      if (
        asso.fkColumnName?.includes(searchValue) ||
        asso.fkAttributeName?.includes(searchValue) ||
        asso.fkAttributeDisplayName?.includes(searchValue)
      ) {
        return true;
      }
      return false;
    });
    return filterEntityAssos;
  }, [hasDeleteFlagEntityAssos]);

  const handleChange = (e: any) => {
    const searchValue = e.currentTarget.value;
    setSearchValue(searchValue);
    setEntityTableRowKeys([]);
  };

  /**恢复删除实体 */
  const handleEntityRestore = () => {
    const reStoreEntityAsso = filterEntityAssos.find((asso) =>
      entityTableKeys.includes(asso.idEntityAssociate!),
    );
    if (reStoreEntityAsso) {
      dispatch(actions.recoverEntityAsso(reStoreEntityAsso));
    }
    setEntityTableRowKeys([]);
    setSearchValue(undefined);
  };

  /**行操作 */
  const handleRow = (record: TEntityAssociate) => {
    return {
      onClick: async (_event: any) => {
        setEntityTableRowKeys([record.idEntityAssociate!]);
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
                {hasDeleteFlagEntityAssos?.length ?? 0}
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
                {filterEntityAssos.length ?? 0}
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
          <Table<TEntityAssociate>
            className={styles['my-ant-pro-table']}
            rowKey={'idEntityAssociate'}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
            dataSource={filterEntityAssos}
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
      </div>
    </>
  );
};

export default ToRemoveEntityAsso;

const useColumns = () => {
  const allEntities = useAllEntities();

  const typeColumns: TableColumnType<TEntityAssociate>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      render: (text, record, index) => {
        const a = record.idEntityAssociate;
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'idEntityAssociate',
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
      title: '上级实体',
      dataIndex: 'idUp',
      render: (value: any) => {
        const findEntity = allEntities.find(
          (entity) => entity.idEntity === value,
        );
        const content = findEntity ? findEntity.displayName : '--';
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
      title: '下级实体',
      dataIndex: 'idDown',
      render: (value: any) => {
        const findEntity = allEntities.find(
          (entity) => entity.idEntity === value,
        );
        const content = findEntity ? findEntity.displayName : '--';
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
      title: '外键字段',
      dataIndex: 'fkColumnName',
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
      title: '外键属性',
      dataIndex: 'fkAttributeName',
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
      title: '外键显示名称',
      dataIndex: 'fkAttributeDisplayName',
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

  return { typeColumns };
};
