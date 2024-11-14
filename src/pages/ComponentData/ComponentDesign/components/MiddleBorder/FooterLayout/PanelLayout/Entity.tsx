import { FC, useState } from 'react';
import { Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNotDeleteCompEntitys,
  selectComponentNodeUis,
  actions,
  selectModuleUi,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TComponentNodeUi,
  TComponentEntity,
} from '@/pages/ComponentData/ComponentDesign/models';

const EntityLayout: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const entitys = useSelector(selectNotDeleteCompEntitys);
  const nodeUis = useSelector(selectComponentNodeUis);
  const dispatch = useDispatch();

  const columns: TableColumnType<TComponentEntity>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: 'idComponentEntity',
      title: 'id',
      render: (value: any, record: TComponentEntity, index: number) => {
        return (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              dispatch(actions.updateGoToId(value));
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      dataIndex: 'className',
      title: '类名称',
      render: (text, record, index) => {
        return record.ddEntity?.className;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      render: (text, record, index) => {
        return record.ddEntity?.displayName;
      },
    },
    {
      dataIndex: 'nodeUi',
      title: 'UI信息',
      render: (value, record) => {
        let nodeUi: TComponentNodeUi | undefined;
        nodeUi = nodeUis?.find(
          (nodeUi) => nodeUi.idElement === record.idComponentEntity,
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
        rowKey={'idComponentEntity'}
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
