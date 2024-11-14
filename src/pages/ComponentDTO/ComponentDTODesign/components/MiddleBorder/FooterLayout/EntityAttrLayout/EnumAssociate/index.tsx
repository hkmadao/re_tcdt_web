import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectNotCurrentDtoEnumAssos,
  selectNotDeleteEnums,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEnumAssociate,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { selectModuleUi } from '@/pages/ComponentDTO/ComponentDTODesign/store';

const EnumAssociate: FC = () => {
  const enums = useSelector(selectNotDeleteEnums);
  const moduleUi = useSelector(selectModuleUi);
  const currentEnumAssos = useSelector(selectNotCurrentDtoEnumAssos);

  const currentEntity = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return undefined;
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].dtoCollection.dtoEntities?.find(
      (entityFind) => entityFind.idDtoEntity === idElement,
    );
  });

  const attrDataSource = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return [];
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return (
      state[moduleName].dtoCollection.dtoEntities
        ?.find((entityFind) => entityFind.idDtoEntity === idElement)
        ?.deAttributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  const columns: TableColumnType<TDtoEnumAssociate>[] = [
    {
      dataIndex: 'idDtoEntityAttribute',
      title: '属性',
      render: (value, record) => {
        const attribute = attrDataSource.find(
          (attr) => record.idDtoEntityAttribute === attr.idDtoEntityAttribute,
        );
        if (attribute) {
          return (
            <>{attribute?.displayName + '(' + attribute?.attributeName + ')'}</>
          );
        }
        return <>{'--'}</>;
      },
    },
    {
      dataIndex: 'idDtoEntity',
      title: '实体',
      render: (value, record) => {
        return (
          <>
            {currentEntity?.displayName + '(' + currentEntity?.className + ')'}
          </>
        );
      },
    },
    {
      dataIndex: 'idEnum',
      title: '枚举',
      render: (value, record) => {
        let findEnum = enums?.find(
          (ddEnum) => ddEnum.idDtoEnum === record.idDtoEnum,
        );
        return <>{findEnum?.displayName + '(' + findEnum?.className + ')'}</>;
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
        dataSource={currentEnumAssos}
        pagination={{
          total: currentEnumAssos?.length,
          pageSize: currentEnumAssos?.length,
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
