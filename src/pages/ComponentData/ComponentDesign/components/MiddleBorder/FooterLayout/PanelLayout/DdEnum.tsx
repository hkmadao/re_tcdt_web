import { FC, useState } from 'react';
import { Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectModuleUi,
  selectComponentNodeUis,
  selectNotDeleteComponentEnums,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TComponentNodeUi,
  TComponentEnum,
} from '@/pages/ComponentData/ComponentDesign/models';

const DdEnum: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const componentEnums = useSelector(selectNotDeleteComponentEnums);
  const nodeUis = useSelector(selectComponentNodeUis);
  const dispatch = useDispatch();

  const columns: TableColumnType<TComponentEnum>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: 'idComponentEnum',
      title: 'id',
      render: (value: any, record: TComponentEnum, index: number) => {
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
      render: (value: any, record: TComponentEnum, index: number) => {
        return <span>{record.ddEnum?.className}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      render: (value: any, record: TComponentEnum, index: number) => {
        return <span>{record.ddEnum?.displayName}</span>;
      },
    },
    {
      dataIndex: 'nodeUi',
      title: 'UI信息',
      render: (value, record) => {
        let nodeUi: TComponentNodeUi | undefined;
        nodeUi = nodeUis?.find(
          (nodeUi) => nodeUi.idElement === record.idComponentEnum,
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
        rowKey={'idEnum'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={componentEnums}
        pagination={{
          total: componentEnums?.length,
          pageSize: componentEnums?.length,
          // onChange: onPageChange,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
    </>
  );
};

export default DdEnum;
