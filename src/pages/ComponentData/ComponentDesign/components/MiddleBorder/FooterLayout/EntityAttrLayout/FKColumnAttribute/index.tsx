import { FC, useState } from 'react';
import { Button, message, Modal, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectCurrentComponentEntity,
  selectFKColumnEntityAssos,
  selectNotDeleteEntityAssos,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TComponentEntityAssociate,
  TEntity,
  TEntityAssociate,
} from '@/pages/ComponentData/ComponentDesign/models';
import { selectModuleUi } from '@/pages/ComponentData/ComponentDesign/store';
import API from '@/pages/DescriptData/DescriptDesign/api';

const FKColumnAttribute: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useSelector(selectModuleUi);
  const fkComponentEntityAssociates = useSelector(selectFKColumnEntityAssos);
  const eAssos = useSelector(selectNotDeleteEntityAssos);
  const [eAssoSelectedRowKeys, setEAssoSelectedRowKeys] = useState<React.Key[]>(
    [],
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [assos, setAssos] = useState<TEntityAssociate[]>([]);
  const currentCE = useSelector(selectCurrentComponentEntity);

  const columns: TableColumnType<TComponentEntityAssociate>[] = [
    {
      dataIndex: 'fkColumnName',
      title: '外键字段',
      render: (value, record) => {
        return <>{record.entityAssociate?.fkColumnName}</>;
      },
    },
    {
      dataIndex: 'fkAttributeName',
      title: '外键属性',
      render: (value, record) => {
        return <>{record.entityAssociate?.fkAttributeName}</>;
      },
    },
    {
      dataIndex: 'fkAttributeDisplayName',
      title: '外键名称',
      render: (value, record) => {
        return <>{record.entityAssociate?.fkAttributeDisplayName}</>;
      },
    },
    {
      dataIndex: 'refAttributeName',
      title: '引用属性',
      render: (value, record) => {
        return <>{record.entityAssociate?.refAttributeName}</>;
      },
    },
    {
      dataIndex: 'refAttributeDisplayName',
      title: '引用属性名称',
      render: (value, record) => {
        return <>{record.entityAssociate?.refAttributeDisplayName}</>;
      },
    },
    {
      dataIndex: 'idUp',
      title: '引用属性类型',
      render: (value, record) => {
        let upEntity = record.entityAssociate?.upEntity;
        return <>{upEntity?.className}</>;
      },
    },
    {
      dataIndex: 'jcs',
      title: '关联字段',
      render: (value, record) => {
        let jcAttrStr = record.joinColumns?.map((jc) => jc.attributeName || '');
        return <>{jcAttrStr}</>;
      },
    },
    {
      dataIndex: 'upEntity',
      title: '引用实体',
      render: (value, record) => {
        let upEntity = record.upCpEntity?.ddEntity;
        return <>{upEntity?.displayName}</>;
      },
    },
    {
      dataIndex: 'packageName',
      title: '引用属性类型全路径',
      render: (value, record) => {
        let upEntity = record.upCpEntity?.ddEntity;
        if (upEntity) {
          return (
            <>
              {record.upCpEntity?.packageName +
                '.' +
                record?.upCpEntity?.packageName}
            </>
          );
        }
      },
    },
  ];
  /**删除 */
  const handleDelete = () => {
    const deleteAssos = eAssos?.filter((eAsso) =>
      eAssoSelectedRowKeys.includes(eAsso.idComponentEntityAssociate),
    );
    if (deleteAssos) {
      dispatch(actions.deleteComponentEntityAssos(deleteAssos));
    }
  };

  const assoColumns: TableColumnType<TEntityAssociate>[] = [
    {
      dataIndex: 'fkAttributeName',
      title: '外键',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.fkAttributeName}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '关联实体',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.upEntity?.displayName}</span>;
      },
    },
  ];

  /**点击同步 */
  const handleToSync = () => {
    if (currentCE) {
      API.getDetailByEntityId({ idEntity: currentCE.ddEntity?.idEntity! }).then(
        (resEntity: TEntity) => {
          if (resEntity) {
            const fkassos = resEntity.upAssociates;
            const ids = fkComponentEntityAssociates?.map(
              (ea) => ea.idEntityAssociate,
            );
            const fkAddAssos =
              fkassos?.filter((fa) => !ids?.includes(fa.idEntityAssociate!)) ||
              [];
            setAssos(fkAddAssos);
          }
        },
      );
    }
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认同步 */
  const handleSync = () => {
    const sAssos: TEntityAssociate[] = assos.filter((asso) => {
      return selectedRowKeys.includes(asso.idEntityAssociate!);
    });
    if (!sAssos) {
      message.warn('请先选择数据！');
      return;
    }
    dispatch(actions.addComponentEntityAssos(sAssos));
    setModalVisible(false);
  };

  return (
    <>
      <Button size={'small'} onClick={handleToSync}>
        {'同步'}
      </Button>
      <Button
        size={'small'}
        disabled={eAssoSelectedRowKeys.length < 1}
        onClick={handleDelete}
      >
        {'删除'}
      </Button>
      <Table
        rowKey={'idComponentEntityAssociate'}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
        columns={columns}
        dataSource={fkComponentEntityAssociates}
        rowSelection={{
          type: 'checkbox',
          onChange: setEAssoSelectedRowKeys,
          selectedRowKeys: eAssoSelectedRowKeys,
        }}
        pagination={{
          total: fkComponentEntityAssociates?.length,
          pageSize: fkComponentEntityAssociates?.length,
          // onChange: onPageChange,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
      <Modal
        title="选择数据"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleSync}
        width={'800px'}
      >
        <Table
          rowKey={'idEntityAssociate'}
          scroll={{ y: '300px' }}
          bordered={true}
          size={'small'}
          columns={assoColumns}
          dataSource={assos}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Modal>
    </>
  );
};

export default FKColumnAttribute;
