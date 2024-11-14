import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectOutEntities,
  selectFKColumnEntityAssos,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntityAssociate } from '@/pages/DescriptData/DescriptDesign/models';

const FKColumnAttribute: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const outEntities = useSelector(selectOutEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectFKColumnEntityAssos);

  const columns: TableColumnType<TEntityAssociate>[] = [
    {
      dataIndex: 'fkColumnName',
      title: '外键字段',
      render: (value, record) => {
        return <>{record.fkColumnName}</>;
      },
    },
    {
      dataIndex: 'fkAttributeName',
      title: '外键属性',
      render: (value, record) => {
        return <>{record.fkAttributeName}</>;
      },
    },
    {
      dataIndex: 'fkAttributeDisplayName',
      title: '外键名称',
      render: (value, record) => {
        return <>{record.fkAttributeDisplayName}</>;
      },
    },
    {
      dataIndex: 'refAttributeName',
      title: '引用属性',
      render: (value, record) => {
        return <>{record.refAttributeName}</>;
      },
    },
    {
      dataIndex: 'refAttributeDisplayName',
      title: '引用属性名称',
      render: (value, record) => {
        return <>{record.refAttributeDisplayName}</>;
      },
    },
    {
      dataIndex: 'idUp',
      title: '引用属性类型',
      render: (value, record) => {
        let upEntity = entities?.find(
          (entity) => entity.idEntity === record.idUp,
        );
        if (!upEntity) {
          upEntity = outEntities?.find(
            (entity) => entity.idEntity === record.idUp,
          );
        }
        return <>{upEntity?.className}</>;
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

export default FKColumnAttribute;
