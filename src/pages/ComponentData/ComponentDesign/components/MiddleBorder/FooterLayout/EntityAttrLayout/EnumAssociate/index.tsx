import { FC } from 'react';
import { Table, TableColumnType } from 'antd';
import { useSelector } from 'react-redux';
import {
  selectEnumAssos,
  selectEnums,
  selectOutEnums,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TEnumAssociate,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import { DOStatus } from '@/models/enums';
import { selectModuleUi } from '@/pages/ComponentData/ComponentDesign/store';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';

const EnumAssociate: FC = () => {
  const enums = useSelector(selectEnums);
  const outEnums = useSelector(selectOutEnums);
  const moduleUi = useSelector(selectModuleUi);
  const currentEnumAssos = useSelector(selectEnumAssos);

  const currentEntity = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return undefined;
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].component.componentEntities?.find(
      (entityFind) => entityFind.idComponentEntity === idElement,
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
      state[moduleName].component.componentEntities
        ?.find((entityFind) => entityFind.idComponentEntity === idElement)
        ?.ddEntity?.attributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  const columns: TableColumnType<TEnumAssociate>[] = [
    {
      dataIndex: 'idAttribute',
      title: '属性',
      render: (value, record) => {
        const attribute = attrDataSource.find(
          (attr) => record.idAttribute === attr.idAttribute,
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
      dataIndex: 'idEntity',
      title: '实体',
      render: (value, record) => {
        return (
          <>
            {currentEntity?.ddEntity?.displayName +
              '(' +
              currentEntity?.ddEntity?.className +
              ')'}
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
