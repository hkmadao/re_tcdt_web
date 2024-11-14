import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectFKColumnEntityAssos,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { TDtoEntityAssociate } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';

const FKColumnAttribute: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectFKColumnEntityAssos);

  const columns: TableColumnType<TDtoEntityAssociate>[] = [
    {
      dataIndex: 'idDtoEntityAssociate',
      title: 'ID',
      render: (value, record) => {
        return <>{record.idDtoEntityAssociate}</>;
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
          (entity) => entity.idDtoEntity === record.idUp,
        );
        return <>{upEntity?.className}</>;
      },
    },
  ];

  return (
    <>
      <Table
        rowKey={'idDtoEntityAssociate'}
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
