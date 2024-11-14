import { FC } from 'react';
import { Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNodeUis,
  actions,
  selectOutEntities,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntity, TNodeUi } from '@/pages/DescriptData/DescriptDesign/models';

const OutEntityLayout: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const entitys = useSelector(selectOutEntities);
  const nodeUis = useSelector(selectNodeUis);
  const dispatch = useDispatch();

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
      <Table
        rowKey={'idEntity'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={entitys}
        pagination={{
          total: entitys?.length,
          pageSize: entitys?.length,
          // onChange: onPageChange,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
    </>
  );
};

export default OutEntityLayout;
