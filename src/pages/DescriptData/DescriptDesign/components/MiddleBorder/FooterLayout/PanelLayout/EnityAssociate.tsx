import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntityAssos,
  selectNotDeleteEntities,
  selectOutEntities,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntityAssociate } from '@/pages/DescriptData/DescriptDesign/models';

const EnityAssociate: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const outEntities = useSelector(selectOutEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectNotDeleteEntityAssos);

  const columns: TableColumnType<TEntityAssociate>[] = [
    {
      dataIndex: 'idEntityAssociate',
      title: 'id',
    },
    {
      dataIndex: 'idUp',
      title: '上级实体',
      render: (value, record) => {
        let parentEntity = entities?.find(
          (entity) => entity.idEntity === record.idUp,
        );
        if (!parentEntity) {
          parentEntity = outEntities?.find(
            (entity) => entity.idEntity === value,
          );
        }
        return (
          <>
            {parentEntity?.displayName}({parentEntity?.tableName})
          </>
        );
      },
    },
    {
      dataIndex: 'idDown',
      title: '下级实体',
      render: (value, record) => {
        const childEntity = entities?.find(
          (entity) => entity.idEntity === record.idDown,
        );
        return (
          <>
            {childEntity?.displayName}({childEntity?.tableName})
          </>
        );
      },
    },
    {
      dataIndex: 'fkColumnName',
      title: '外键',
      render: (value, record) => {
        if (!record.fkColumnName) {
          return '--';
        }
        return (
          <>
            {record?.fkAttributeDisplayName}({record?.fkColumnName})
          </>
        );
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
