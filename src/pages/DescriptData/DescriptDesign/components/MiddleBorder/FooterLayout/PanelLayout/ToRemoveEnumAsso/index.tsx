import { Button, Input, InputRef, Popover, Table, TableColumnType } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import { TEnumAssociate } from '@/pages/DescriptData/DescriptDesign/models';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import { useDispatch } from 'react-redux';
import {
  useIdCollection,
  useModuleUi,
  useAllEntities,
  useAllEnums,
  useHasDeleteFLagEnumAsso,
} from '@/pages/DescriptData/DescriptDesign/hooks';

const ToRemoveEnumAsso: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useModuleUi();
  const [entityTableKeys, setEntityTableRowKeys] = useState<React.Key[]>([]);
  const { typeColumns } = useColumns();
  const hasDeleteFlagEnumAssos = useHasDeleteFLagEnumAsso();
  const idCollection = useIdCollection();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    setEntityTableRowKeys([]);
    setSearchValue(undefined);
  }, [idCollection]);

  const filterEnumAssos = useMemo(() => {
    const filterEnumAssos = hasDeleteFlagEnumAssos.filter((asso) => {
      return true;
    });
    return filterEnumAssos;
  }, [hasDeleteFlagEnumAssos]);

  const handleChange = (e: any) => {
    const searchValue = e.currentTarget.value;
    setSearchValue(searchValue);
    setEntityTableRowKeys([]);
  };

  /**恢复删除实体 */
  const handleEntityRestore = () => {
    const reStoreEntityAsso = filterEnumAssos.find((asso) =>
      entityTableKeys.includes(asso.idEnumAssociate!),
    );
    if (reStoreEntityAsso) {
      dispatch(actions.recoverEnumAsso(reStoreEntityAsso));
    }
    setEntityTableRowKeys([]);
    setSearchValue(undefined);
  };

  /**行操作 */
  const handleRow = (record: TEnumAssociate) => {
    return {
      onClick: async (_event: any) => {
        setEntityTableRowKeys([record.idEnumAssociate!]);
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
                {hasDeleteFlagEnumAssos?.length ?? 0}
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
                {filterEnumAssos.length ?? 0}
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
          <Table<TEnumAssociate>
            className={styles['my-ant-pro-table']}
            rowKey={'idEnumAssociate'}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
            dataSource={filterEnumAssos}
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

export default ToRemoveEnumAsso;

const useColumns = () => {
  const allEntities = useAllEntities();
  const allEnums = useAllEnums();

  const typeColumns: TableColumnType<TEnumAssociate>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      render: (text, record, index) => {
        const a = record.idEnumAssociate;
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'idEnumAssociate',
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
      title: '实体',
      dataIndex: 'idEntity',
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
      title: '枚举',
      dataIndex: 'idEnum',
      render: (value: any) => {
        const findEnum = allEnums.find((entity) => entity.idEnum === value);
        const content = findEnum ? findEnum.displayName : '--';
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
      title: '属性',
      dataIndex: 'idAttribute',
      render: (value: any, record) => {
        const findEntity = allEntities.find(
          (entity) => entity.idEntity === value,
        );
        const findAttr = findEntity?.attributes?.find(
          (attr) => attr.idAttribute === value,
        );
        const content = findAttr ? findAttr.attributeName : '--';
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
