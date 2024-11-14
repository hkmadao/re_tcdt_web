import { FC, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteEntities,
  selectNotDeleteEnumAssos,
  selectNotDeleteEnums,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { TDtoEnumAssociate } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { DOStatus } from '@/models/enums';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';

const EnumAssociate: FC = () => {
  const entities = useSelector(selectNotDeleteEntities);
  const enums = useSelector(selectNotDeleteEnums);
  const moduleUi = useSelector(selectModuleUi);
  const enumAssociates = useSelector(selectNotDeleteEnumAssos);

  const columns: TableColumnType<TDtoEnumAssociate>[] = [
    {
      dataIndex: 'idEnumAssociate',
      title: 'id',
    },
    {
      dataIndex: 'idEnum',
      title: '枚举',
      render: (value, record) => {
        let parentEnum = enums?.find(
          (ddEnum) => ddEnum.idDtoEnum === record.idDtoEnum,
        );
        return <>{parentEnum?.displayName}</>;
      },
    },
    {
      dataIndex: 'idDtoEntity',
      title: '实体',
      render: (value, record) => {
        const entity = entities?.find((entity) => record.idDtoEntity === value);
        return <>{entity?.displayName}</>;
      },
    },
    {
      dataIndex: 'idDtoEntityAttribute',
      title: '属性',
      render: (value, record) => {
        const attribute = entities
          ?.find((entity) => entity.idDtoEntity === record.idDtoEntity)
          ?.deAttributes?.find(
            (attribute) =>
              attribute.action !== DOStatus.DELETED &&
              attribute.idDtoEntityAttribute === record.idDtoEntityAttribute,
          );
        return <>{attribute?.note}</>;
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
