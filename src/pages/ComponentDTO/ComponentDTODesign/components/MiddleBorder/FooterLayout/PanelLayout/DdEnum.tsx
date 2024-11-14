import { FC, useState } from 'react';
import { Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectNodeUis,
  selectNotDeleteEnums,
  selectModuleUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEnum,
  TDtoNodeUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';

const DdEnum: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const enums = useSelector(selectNotDeleteEnums);
  const nodeUis = useSelector(selectNodeUis);
  const dispatch = useDispatch();

  const columns: TableColumnType<TDtoEnum>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: 'idEnum',
      title: 'id',
      render: (value: any, record: TDtoEnum, index: number) => {
        return (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => dispatch(actions.updateGoToId(record.idDtoEnum))}
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
          (nodeUi) => nodeUi.idElement === record.idDtoEnum,
        );
        if (nodeUi) {
          return (
            <Space size={20}>
              <span>{'width:' + nodeUi?.width}</span>
              <span>{'height:' + nodeUi?.height}</span>
              <span>{'x:' + nodeUi?.x}</span>
              <span>{'y:' + nodeUi?.y}</span>
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
        rowKey={'idDtoEnum'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={enums}
        pagination={{
          total: enums?.length,
          pageSize: enums?.length,
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
