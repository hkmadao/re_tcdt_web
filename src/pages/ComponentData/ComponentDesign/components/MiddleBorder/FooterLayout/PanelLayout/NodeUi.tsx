import { FC, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectComponentEntities,
  selectComponentEnums,
  selectComponentNodeUis,
  selectOutEntities,
  selectOutEnums,
  selectModuleUi,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TEntity,
  TEnum,
  TComponentNodeUi,
} from '@/pages/ComponentData/ComponentDesign/models';

const NodeUi: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const nodeUis = useSelector(selectComponentNodeUis);
  const entitys = useSelector(selectComponentEntities);
  const outEntities = useSelector(selectOutEntities);
  const enums = useSelector(selectComponentEnums);
  const outEnums = useSelector(selectOutEnums);

  const columns: TableColumnType<TComponentNodeUi>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: 'idElement',
      title: '元素信息',
      render: (value, record) => {
        let element: TEntity | TEnum | undefined;
        element = entitys?.find(
          (entity) => entity.idEntity === record.idElement,
        )?.ddEntity;
        if (element) {
          return <>{element?.displayName} [实体]</>;
        }
        element = outEntities?.find(
          (entity) => entity.idEntity === record.idElement,
        );
        if (element) {
          return <>{element?.displayName} [外部实体]</>;
        }
        element = enums?.find(
          (ddEnum) => ddEnum.idEnum === record.idElement,
        )?.ddEnum;
        if (element) {
          return <>{element?.displayName} [枚举]</>;
        }
        element = outEnums?.find(
          (ddEnum) => ddEnum.idEnum === record.idElement,
        );
        if (element) {
          return <>{element?.displayName} [外部枚举]</>;
        }
        return <>{''}</>;
      },
    },
    {
      dataIndex: 'x',
      title: 'x坐标',
    },
    {
      dataIndex: 'y',
      title: 'y坐标',
    },
    {
      dataIndex: 'width',
      title: '宽度',
    },
    {
      dataIndex: 'height',
      title: '高度',
    },
  ];
  return (
    <>
      <Table
        rowKey={'idEntity'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={nodeUis}
        pagination={{
          total: nodeUis?.length,
          pageSize: nodeUis?.length,
          // onChange: onPageChange,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
    </>
  );
};

export default NodeUi;
