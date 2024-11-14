import { FC, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectNotDeleteEnumAssos,
  selectNotDeleteEnums,
  selectOutEnums,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEnumAssociate } from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';

const EnumAssociate: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const enums = useSelector(selectNotDeleteEnums);
  const outEnums = useSelector(selectOutEnums);
  const moduleUi = useSelector(selectModuleUi);
  const enumAssociates = useSelector(selectNotDeleteEnumAssos);

  const columns: TableColumnType<TEnumAssociate>[] = [
    {
      dataIndex: 'idEnumAssociate',
      title: 'id',
    },
    {
      dataIndex: 'idEntity',
      title: '实体',
      render: (value, record) => {
        const entity = entities?.find(
          (entity) => entity.idEntity === record.idEntity,
        );
        return (
          <>
            {entity?.displayName}({entity?.tableName})
          </>
        );
      },
    },
    {
      dataIndex: 'idEnum',
      title: '枚举',
      render: (value, record) => {
        let findEnum = enums?.find((ddEnum) => ddEnum.idEnum === record.idEnum);
        if (!findEnum) {
          findEnum = outEnums?.find(
            (ddEnum) => ddEnum.idEnum === record.idEnum,
          );
        }
        return (
          <>
            {findEnum?.displayName}({findEnum?.className})
          </>
        );
      },
    },
    {
      dataIndex: 'idAttribute',
      title: '属性',
      render: (value, record) => {
        const attribute = entities
          ?.find((entity) => entity.idEntity === record.idEntity)
          ?.attributes?.find(
            (attribute) =>
              attribute.action !== DOStatus.DELETED &&
              attribute.idAttribute === record.idAttribute,
          );
        if (!attribute) {
          return '--';
        }
        return (
          <>
            {attribute?.note}({attribute?.columnName})
          </>
        );
      },
    },
  ];
  return (
    <>
      <Table
        rowKey={'idEnumAssociate'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={enumAssociates}
        pagination={{
          total: enumAssociates?.length,
          pageSize: enumAssociates?.length,
          // onChange: onPageChange,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
    </>
  );
};

export default EnumAssociate;
