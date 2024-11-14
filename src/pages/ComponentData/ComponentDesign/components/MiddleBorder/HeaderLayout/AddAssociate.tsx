import React, { FC, Key, useEffect, useState } from 'react';
import { Modal, Button, Table, TableColumnType, message, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectEntityComponent } from '../../../store';
import { TComponentEntity, TEntity, TEntityAssociate } from '../../../models';
import API from '@/pages/DescriptData/DescriptDesign/api';
import { TEntityCollection } from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';
import { AppstoreAddOutlined } from '@ant-design/icons';

const AddAssociate: FC = () => {
  const [entityCollection, setEntityCollection] = useState<TEntityCollection>();
  const [buttonDisabeld, setButtonDisabeld] = useState<boolean>(true);
  const component = useSelector(selectEntityComponent);
  const dispatch = useDispatch();
  const [assoModalVisible, setAssoModalVisible] = useState<boolean>(false);
  const [assos, setAssos] = useState<TEntityAssociate[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (component?.idMainComponentEntity) {
      setButtonDisabeld(false);
    } else {
      setButtonDisabeld(true);
    }
  }, [component]);

  const assoColumns: TableColumnType<TEntityAssociate>[] = [
    {
      dataIndex: 'downEntity',
      title: '下级实体',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record?.downEntity?.displayName}</span>;
      },
    },
    {
      dataIndex: 'fkColumnName',
      title: '外键',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.fkColumnName}</span>;
      },
    },
    {
      dataIndex: 'fkAttributeName',
      title: '外键属性',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.fkAttributeName}</span>;
      },
    },
    {
      dataIndex: 'fkAttributeDisplayName',
      title: '外键名称',
      render: (value: any, record: TEntityAssociate, index: number) => {
        return <span>{record.fkAttributeDisplayName}</span>;
      },
    },
  ];

  /**点击添加关系 */
  const handleToAddAsso = () => {
    setSelectedRowKeys([]);
    setAssos([]);
    let selectCe: TComponentEntity | undefined;
    selectCe = component?.componentEntities?.find((componentEntity) => {
      return (
        componentEntity.idComponentEntity === component.idMainComponentEntity
      );
    });
    if (!selectCe) {
      return;
    }
    API.getSimpleCollection({
      idEntityCollection: selectCe?.ddEntity?.idEntityCollection!,
    }).then((resEntityCollection: TEntityCollection) => {
      if (resEntityCollection) {
        setEntityCollection(resEntityCollection);
        if (resEntityCollection.entityAssociates) {
          const newAssos = resEntityCollection.entityAssociates.filter(
            (asso) => {
              //查找已经添加的连线
              const find = component?.componentEntityAssociates?.find(
                (componentEntityAssociate) => {
                  return (
                    componentEntityAssociate.entityAssociate?.idDown ===
                      asso.idDown &&
                    componentEntityAssociate.action !== DOStatus.DELETED &&
                    componentEntityAssociate.fgAggAsso
                  );
                },
              );
              //子实体
              const isChild = asso.idUp === selectCe?.ddEntity?.idEntity;
              return isChild && !find;
            },
          );
          (newAssos as TEntityAssociate[]).forEach((asso) => {
            const downEnity = resEntityCollection.entities.find(
              (ddEnti) => ddEnti.idEntity === asso.idDown,
            );
            asso.downEntity = downEnity;
          });
          setAssos(newAssos);
        }
      }
    });
    setAssoModalVisible(true);
  };
  const handleAssoCloseModal = () => {
    setAssoModalVisible(false);
  };
  /**确认添加关系 */
  const handleAddAsso = () => {
    const newAssos: TEntityAssociate[] = assos.filter((asso) => {
      return selectedRowKeys.indexOf(asso.idEntityAssociate!) > -1;
    });

    if (entityCollection) {
      const childEntities = newAssos?.map((asso) => {
        return { ...asso.downEntity } as TEntity;
      });
      const ids = childEntities.map((childEntity) => childEntity.idEntity);
      API.getDetailByEntityIds({ idEntityList: ids.join(',') }).then(
        (resEntities: TEntity[]) => {
          if (resEntities) {
            const params: {
              idEntityAssociate: string;
              childEntity: TEntity;
            }[] = [];
            resEntities.forEach((resEntity) => {
              const findAsso = newAssos.find(
                (asso) => asso.idDown === resEntity.idEntity,
              );
              if (findAsso) {
                params.push({
                  idEntityAssociate: findAsso?.idEntityAssociate!,
                  childEntity: resEntity,
                });
              }
            });
            dispatch(actions.setComponentEntityAsso(params));
          }
        },
      );
    }
    setAssoModalVisible(false);
  };

  const handleSelectRowChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**表格行行为 */
  const onRow = (record: TEntityAssociate) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        if (selectedRowKeys.includes(record.idEntityAssociate!)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((k) => k !== record.idEntityAssociate),
          );
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.idEntityAssociate!]);
        }
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  return (
    <>
      <Tooltip overlay={'添加子实体'}>
        <Button
          size={'small'}
          onClick={handleToAddAsso}
          disabled={buttonDisabeld}
          icon={<AppstoreAddOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        title="选择子实体"
        open={assoModalVisible}
        onCancel={handleAssoCloseModal}
        onOk={handleAddAsso}
        okButtonProps={{ disabled: !selectedRowKeys?.length }}
        width={'800px'}
      >
        <Table
          rowKey={'idEntityAssociate'}
          bordered={true}
          size={'small'}
          columns={assoColumns}
          dataSource={assos}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange: handleSelectRowChange,
          }}
          onRow={onRow}
        />
      </Modal>
    </>
  );
};

export default AddAssociate;
