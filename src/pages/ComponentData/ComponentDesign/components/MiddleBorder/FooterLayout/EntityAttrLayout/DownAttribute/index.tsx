import { FC, useState } from 'react';
import { Button, message, Modal, Table, TableColumnType } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectModuleUi } from '@/pages/ComponentData/ComponentDesign/store/selects';
import {
  actions,
  selectCurrentComponentEntity,
  selectDownEntityAssos,
  selectNotDeleteEntityAssos,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TComponentEntityAssociate,
  TEntity,
  TEntityAssociate,
} from '@/pages/ComponentData/ComponentDesign/models';
import API from '@/pages/DescriptData/DescriptDesign/api';

const DownAttribute: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useSelector(selectModuleUi);
  const cEntityAssociates = useSelector(selectDownEntityAssos);
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
      dataIndex: 'downAttributeName',
      title: '属性',
      render: (value, record) => {
        return <>{record.entityAssociate?.downAttributeName}</>;
      },
    },
    {
      dataIndex: 'downAttributeDisplayName',
      title: '名称',
      render: (value, record) => {
        return <>{record.entityAssociate?.downAttributeDisplayName}</>;
      },
    },
    {
      dataIndex: 'attributeType',
      title: '类型',
      render: (value, record) => {
        let downEntity = record.entityAssociate?.downEntity;
        return <>{downEntity?.className}</>;
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
      dataIndex: 'downAttributeName',
      title: '关联属性',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.downAttributeName}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '关联实体',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.downEntity?.displayName}</span>;
      },
    },
  ];

  /**点击同步 */
  const handleToSync = () => {
    if (currentCE) {
      API.getDetailByEntityId({ idEntity: currentCE.ddEntity?.idEntity! }).then(
        (resEntity: TEntity) => {
          if (resEntity) {
            const downAssos = resEntity.downAssociates;
            const ids = cEntityAssociates?.map((ea) => ea.idEntityAssociate);
            const downAddAssos =
              downAssos?.filter(
                (fa) =>
                  !ids?.includes(fa.idEntityAssociate!) && fa.downAttributeName,
              ) || [];
            setAssos(downAddAssos);
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
        dataSource={cEntityAssociates}
        rowSelection={{
          type: 'checkbox',
          onChange: setEAssoSelectedRowKeys,
          selectedRowKeys: eAssoSelectedRowKeys,
        }}
        pagination={{
          total: cEntityAssociates?.length,
          pageSize: cEntityAssociates?.length,
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

export default DownAttribute;
