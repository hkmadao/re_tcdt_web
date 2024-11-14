import { FC } from 'react';
import { Space, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectNodeUis,
  selectOutEnums,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEnum, TNodeUi } from '@/pages/DescriptData/DescriptDesign/models';

const OutEnum: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const enums = useSelector(selectOutEnums);
  const nodeUis = useSelector(selectNodeUis);
  const dispatch = useDispatch();

  const columns: TableColumnType<TEnum>[] = [
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
      render: (value: any, record: TEnum, index: number) => {
        return (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => dispatch(actions.updateGoToId(record.idEnum))}
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
        nodeUi = nodeUis?.find((nodeUi) => nodeUi.idElement === record.idEnum);
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

export default OutEnum;
