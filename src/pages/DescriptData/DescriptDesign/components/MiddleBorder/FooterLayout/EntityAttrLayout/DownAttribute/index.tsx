import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectOutEntities,
  selectDownEntityAssos,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntityAssociate } from '@/pages/DescriptData/DescriptDesign/models';

const DownAttribute: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const outEntities = useSelector(selectOutEntities);
  const moduleUi = useSelector(selectModuleUi);
  const entityAssociates = useSelector(selectDownEntityAssos);

  const columns: TableColumnType<TEntityAssociate>[] = [
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
          (entity) => entity.idEntity === record.idDown,
        );
        if (!downEntity) {
          downEntity = outEntities?.find((entity) => entity.idEntity === value);
        }
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
