import { FC, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectEntitys,
  selectEnums,
  selectNodeUis,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEntity,
  TDtoEnum,
  TDtoNodeUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';

const NodeUi: FC = () => {
  const moduleUi = useSelector(selectModuleUi);
  const nodeUis = useSelector(selectNodeUis);
  const entitys = useSelector(selectEntitys);
  const enums = useSelector(selectEnums);

  const columns: TableColumnType<TDtoNodeUi>[] = [
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
        let element: TDtoEntity | TDtoEnum | undefined;
        element = entitys?.find(
          (entity) => entity.idDtoEntity === record.idElement,
        );
        if (element) {
          return <>{element?.displayName} [实体]</>;
        }
        element = enums?.find(
          (ddEnum) => ddEnum.idDtoEnum === record.idElement,
        );
        if (element) {
          return <>{element?.displayName} [枚举]</>;
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
        rowKey={'idDtoEntity'}
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
