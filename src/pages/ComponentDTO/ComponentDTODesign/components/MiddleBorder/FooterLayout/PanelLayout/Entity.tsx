import { FC, useState } from 'react';
import { Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectNodeUis,
  selectModuleUi,
  actions,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEntity,
  TDtoNodeUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';

const EntityLayout: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const entitys = useSelector(selectNotDeleteEntities);
  const nodeUis = useSelector(selectNodeUis);
  const dispatch = useDispatch();

  const columns: TableColumnType<TDtoEntity>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: 'idDtoEntity',
      title: 'id',
      render: (value: any, record: TDtoEntity, index: number) => {
        return (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => dispatch(actions.updateGoToId(record.idDtoEntity))}
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
        let nodeUi: TDtoNodeUi | undefined;
        nodeUi = nodeUis?.find(
          (nodeUi) => nodeUi.idElement === record.idDtoEntity,
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
        rowKey={'idDtoEntity'}
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

export default EntityLayout;
