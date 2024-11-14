import { FC, useState } from 'react';
import { Input, Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import {
  selectNotDeleteEntities,
  selectNodeUis,
  selectModuleUi,
  actions,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntity, TNodeUi } from '@/pages/DescriptData/DescriptDesign/models';

const EntityLayout: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const entities = useSelector(selectNotDeleteEntities);
  const nodeUis = useSelector(selectNodeUis);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState<string>();

  const { dataSource } = ((entities, searchValue) => {
    const newDataSource = entities.filter((entity) => {
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
    return { dataSource: newDataSource };
  })(entities, searchValue);

  const handleChange = (e: any) => {
    setSearchValue(e.currentTarget.value);
  };

  const columns: TableColumnType<TEntity>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: 'idEntity',
      title: 'id',
      render: (value: any, record: TEntity, index: number) => {
        return (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => dispatch(actions.updateGoToId(record.idEntity))}
          >
            {value}
          </span>
        );
      },
    },
    {
      dataIndex: 'className',
      title: '类名称',
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
    },
    {
      dataIndex: 'nodeUi',
      title: 'UI信息',
      render: (value, record) => {
        let nodeUi: TNodeUi | undefined;
        nodeUi = nodeUis?.find(
          (nodeUi) => nodeUi.idElement === record.idEntity,
        );
        if (nodeUi) {
          return (
            <Space size={20}>
              <>{'width:' + nodeUi?.width}</>
              <>{'height:' + nodeUi?.height}</>
              <>{'x:' + nodeUi?.x}</>
              <>{'y:' + nodeUi?.y}</>
            </Space>
          );
        }
        return <>{''}</>;
      },
    },
  ];
  return (
    <>
      <div
        style={{
          marginBottom: '5px',
        }}
      >
        <span>
          总共
          <span style={{ color: 'blue', margin: '0px 5px', fontSize: '18px' }}>
            {entities?.length ?? 0}
          </span>
          条目，
        </span>
        <span>
          筛选出
          <span style={{ color: 'blue', margin: '0px 5px', fontSize: '18px' }}>
            {dataSource.length ?? 0}
          </span>
          条目
        </span>
        <Input
          size={'small'}
          style={{ width: '200px', marginLeft: '10px' }}
          placeholder="请输入过虑条件"
          onChange={handleChange}
        />
      </div>
      <Table
        rowKey={'idEntity'}
        bordered={true}
        size={'small'}
        scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};

export default EntityLayout;
