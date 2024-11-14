import { FC, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotDeleteCompEntitys,
  selectNotDeleteEnumAssos,
  selectOutEnums,
  selectEnums,
} from '@/pages/ComponentData/ComponentDesign/store';
import { selectModuleUi } from '@/pages/ComponentData/ComponentDesign/store';
import { TEnumAssociate } from '@/pages/ComponentData/ComponentDesign/models';
import { DOStatus } from '@/models/enums';

const EnumAssociate: FC = () => {
  const entities = useSelector(selectNotDeleteCompEntitys);
  const enums = useSelector(selectEnums);
  const outEnums = useSelector(selectOutEnums);
  const moduleUi = useSelector(selectModuleUi);
  const enumAssociates = useSelector(selectNotDeleteEnumAssos);

  const columns: TableColumnType<TEnumAssociate>[] = [
    {
      dataIndex: 'idEnumAssociate',
      title: 'id',
    },
    {
      dataIndex: 'idEnum',
      title: '枚举',
      render: (value, record) => {
        let parentEnum = enums?.find(
          (ddEnum) => ddEnum.idEnum === record.idEnum,
        );
        if (!parentEnum) {
          parentEnum = outEnums?.find(
            (ddEnum) => ddEnum.idEnum === record.idEnum,
          );
        }
        return (
          <>{parentEnum?.displayName + '(' + parentEnum?.className + ')'}</>
        );
      },
    },
    {
      dataIndex: 'idEntity',
      title: '实体',
      render: (value, record) => {
        const entity = entities?.find((entity) => record.idEntity === value);
        return (
          <>
            {entity?.ddEntity?.displayName +
              '(' +
              entity?.ddEntity?.className +
              ')'}
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
          ?.ddEntity?.attributes?.find(
            (attribute) =>
              attribute.action !== DOStatus.DELETED &&
              attribute.idAttribute === record.idAttribute,
          );
        return (
          <>{attribute?.displayName + '(' + attribute?.attributeName + ')'}</>
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
