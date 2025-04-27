import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntityAssos,
  selectNotDeleteCompEntitys,
  selectOutEntities,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  actions,
  selectModuleUi,
} from '@/pages/ComponentData/ComponentDesign/store';
import { TComponentEntityAssociate } from '@/pages/ComponentData/ComponentDesign/models';
import { DOStatus } from '@/models/enums';

const EnityAssociate: FC = () => {
  const componentEntities = useSelector(selectNotDeleteCompEntitys);
  const outEntities = useSelector(selectOutEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectNotDeleteEntityAssos);

  const columns: TableColumnType<TComponentEntityAssociate>[] = [
    {
      dataIndex: 'idComponentEntityAssociate',
      title: 'id',
    },
    {
      dataIndex: 'upEntityId',
      title: '上级实体',
      render: (value, record) => {
        const parentEntity = record.entityAssociate?.upEntity;
        return <>{parentEntity?.displayName}</>;
      },
    },
    {
      dataIndex: 'downEntityId',
      title: '下级实体',
      render: (value, record) => {
        const downEntity = record.entityAssociate?.downEntity;
        return <>{downEntity?.displayName}</>;
      },
    },
    {
      dataIndex: 'fkColumnName',
      title: '外键',
      render: (value, record) => {
        const entityAssociate = record.entityAssociate;
        return <>{entityAssociate?.fkColumnName}</>;
      },
    },
  ];
  return (
    <>
      <Table
        rowKey={'idEntityAssociate'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={entityAssociates}
        pagination={{
          total: entityAssociates?.length,
          pageSize: entityAssociates?.length,
          // onChange: onPageChange,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
    </>
  );
};

export default EnityAssociate;
