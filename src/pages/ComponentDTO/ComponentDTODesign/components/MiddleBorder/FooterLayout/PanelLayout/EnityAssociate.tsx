import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntityAssos,
  selectNotDeleteEntities,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { TDtoEntityAssociate } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';

const EnityAssociate: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectNotDeleteEntityAssos);

  const columns: TableColumnType<TDtoEntityAssociate>[] = [
    {
      dataIndex: 'idDtoEntityAssociate',
      title: 'id',
    },
    {
      dataIndex: 'idUp',
      title: '上级实体',
      render: (value, record) => {
        let parentEntity = entities?.find(
          (entity) => entity.idDtoEntity === record.idUp,
        );
        return <>{parentEntity?.displayName}</>;
      },
    },
    {
      dataIndex: 'idDown',
      title: '下级实体',
      render: (value, record) => {
        const childEntity = entities?.find(
          (entity) => entity.idDtoEntity === record.idDown,
        );
        return <>{childEntity?.displayName}</>;
      },
    },
    {
      dataIndex: 'fkAttributeName',
      title: '关联属性',
      render: (value, record) => {
        if (record.fkAttributeName) {
          return <>{record.fkAttributeName}</>;
        }
        return '--';
      },
    },
    {
      dataIndex: 'refAttributeName',
      title: '关联引用属性',
      render: (value, record) => {
        if (record.refAttributeName) {
          return <>{record.refAttributeName}</>;
        }
        return '--';
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

export default EnityAssociate;
