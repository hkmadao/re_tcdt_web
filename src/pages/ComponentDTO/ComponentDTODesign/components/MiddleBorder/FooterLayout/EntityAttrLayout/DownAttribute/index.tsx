import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectDownEntityAssos,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { TDtoEntityAssociate } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';

const DownAttribute: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectDownEntityAssos);

  const columns: TableColumnType<TDtoEntityAssociate>[] = [
    {
      dataIndex: 'downAttributeName',
      title: '属性',
      render: (value, record) => {
        return <>{record.downAttributeName}</>;
      },
    },
    {
      dataIndex: 'downAttributeDisplayName',
      title: '名称',
      render: (value, record) => {
        return <>{record.downAttributeDisplayName}</>;
      },
    },
    {
      dataIndex: 'attributeType',
      title: '类型',
      render: (value, record) => {
        let downEntity = entities?.find(
          (entity) => entity.idDtoEntity === record.idDown,
        );
        return <>{downEntity?.className}</>;
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

export default DownAttribute;
