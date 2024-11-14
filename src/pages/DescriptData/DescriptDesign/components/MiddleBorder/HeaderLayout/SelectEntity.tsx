import { FC, Key, useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Tree,
  TableColumnsType,
  Tabs,
  Input,
  Space,
  message,
  Divider,
  Button,
} from 'antd';
import { BulbOutlined, ScissorOutlined } from '@ant-design/icons';
import {
  TEntity,
  TEntityCollection,
  TEnum,
} from '@/pages/DescriptData/DescriptDesign/models';
import API from '@/pages/DescriptData/DescriptDesign/api';
import {
  andLogicNode,
  equalFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';
import TreeAPI from '@/pages/DescriptData/DescriptTree/api';
import { fillTreeKey, getTreeParentKeys } from '@/util';
import { EnumTreeNodeType } from '@/pages/DescriptData/DescriptTree/conf';

const columns: TableColumnsType<TEntity> = [
  {
    dataIndex: 'sn',
    title: '序号',
    width: '50px',
    render: (text, record, index) => {
      return index + 1;
    },
  },
  {
    key: 'tableName',
    title: '表名',
    dataIndex: 'tableName',
  },
  {
    key: 'displayName',
    title: '显示名称',
    dataIndex: 'displayName',
  },
];

const enumColumns: TableColumnsType<TEnum> = [
  {
    dataIndex: 'sn',
    title: '序号',
    width: '50px',
    render: (text, record, index) => {
      return index + 1;
    },
  },
  {
    key: 'className',
    title: '类名',
    dataIndex: 'className',
  },
  {
    key: 'displayName',
    title: '显示名称',
    dataIndex: 'displayName',
  },
];

const SelectEntity: FC<{
  modalVisible: boolean;
  handleClose: () => void;
  handleComplete: (entities: TEntity[], enums: TEnum[]) => void;
  idSubProject?: string;
  idCollection?: string;
}> = (props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeDatas, setTreeDatas] = useState<TTree[]>([]);

  const [entitySelectedRowKeys, setEntitySelectedRowKeys] = useState<Key[]>([]);
  const [enumSelectedRowKeys, setEnumSelectedRowKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [coll, setColl] = useState<TEntityCollection>();

  const { entityTableDatas, enumTableDatas } = ((coll, searchValue) => {
    const result: { entityTableDatas: any[]; enumTableDatas: any[] } = {
      entityTableDatas: [],
      enumTableDatas: [],
    };
    if (coll && coll.idEntityCollection !== props.idCollection) {
      if (coll.entities) {
        if (searchValue && searchValue.trim()) {
          const entityTableData = coll.entities.filter((enti) => {
            return (
              enti.tableName?.includes(searchValue) ||
              enti.className?.includes(searchValue) ||
              enti.displayName?.includes(searchValue)
            );
          });
          result.entityTableDatas = entityTableData;
        } else {
          result.entityTableDatas = coll.entities;
        }
      }
      if (coll.enums) {
        if (searchValue && searchValue.trim()) {
          const enumTableDatas = coll.enums.filter((enti) => {
            return (
              enti.className?.includes(searchValue) ||
              enti.displayName?.includes(searchValue)
            );
          });
          result.enumTableDatas = enumTableDatas;
        } else {
          result.enumTableDatas = coll.enums;
        }
      }
    }
    return result;
  })(coll, searchValue);

  useEffect(() => {
    if (props.modalVisible) {
      setSearchValue(undefined);
      setEntitySelectedRowKeys([]);
      setEnumSelectedRowKeys([]);
      setSelectedKeys([]);
      setExpandedKeys([]);
      setColl(undefined);
      fetchProjectTree();
      setModalVisible(true);
    }
    setModalVisible(props.modalVisible);
  }, [props.modalVisible]);

  const fetchProjectTree = () => {
    let params: TCondition | undefined;
    if (props.idSubProject) {
      params = {
        logicNode: andLogicNode([
          equalFilterNode(
            'subProjects.idSubProject',
            stringFilterParam(props.idSubProject),
          ),
        ])(),
      };
    }
    TreeAPI.entityProjectTree(params).then((res: TTree[]) => {
      if (res) {
        const formatedTreeData = fillTreeKey(res);
        setTreeDatas(formatedTreeData);
        if (formatedTreeData.length > 0) {
          const treeKeys = getTreeParentKeys(formatedTreeData);
          setExpandedKeys(treeKeys);
        }
      }
    });
  };

  const handleSelect = (keys: Key[], { node }: { node: TTree }) => {
    if (!keys.includes(node.id!) && node.id !== props.idCollection) {
      setSelectedKeys([...keys, node.id!]);
    } else {
      setSelectedKeys(keys.filter((k) => k !== props.idCollection));
    }
    toggleExpand(node.id!);

    if (node.level === EnumTreeNodeType.ENTITY_COLLECTION) {
      if (node.id !== props.idCollection) {
        setSearchValue(undefined);
        setEntitySelectedRowKeys([]);
        setEnumSelectedRowKeys([]);
        API.getSimpleCollection({
          idEntityCollection: node.id!,
        }).then((resEntityCollection: TEntityCollection) => {
          if (resEntityCollection) {
            setColl(resEntityCollection);
          }
        });
      }
    }
  };

  const handleExpand = (keys: Key[], { node }: { node: TTree }) => {
    toggleExpand(node.id!);
  };

  const toggleExpand = (key: Key) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter((e) => e !== key));
      return;
    }

    setExpandedKeys([...expandedKeys, key]);
  };

  const onTabChange = (tableKey: string) => {
    setEntitySelectedRowKeys([]);
    setEnumSelectedRowKeys([]);
  };

  const handleOk = () => {
    const newEntities =
      entityTableDatas?.filter((tableData) =>
        entitySelectedRowKeys?.includes(tableData.idEntity),
      ) || [];
    const newEnums =
      enumTableDatas?.filter((tableData) =>
        enumSelectedRowKeys?.includes(tableData.idEnum),
      ) || [];
    if (newEntities.length + newEnums.length === 0) {
      message.error('请先选择！');
      return;
    }
    props.handleComplete(newEntities, newEnums);
  };

  const handleCancel = () => {
    props.handleClose();
  };

  const handleChange = (e: any) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleEntitySelectRowChange = (
    selectedRowKeys: Key[],
    selectedRows: any[],
  ) => {
    setEntitySelectedRowKeys(selectedRowKeys);
  };

  /**表格行行为 */
  const handleEntityRow = (record: TEntity) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        if (entitySelectedRowKeys.includes(record.idEntity)) {
          setEntitySelectedRowKeys(
            entitySelectedRowKeys.filter((k) => k !== record.idEntity),
          );
        } else {
          setEntitySelectedRowKeys([...entitySelectedRowKeys, record.idEntity]);
        }
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleEnumSelectRowChange = (
    selectedRowKeys: Key[],
    selectedRows: any[],
  ) => {
    setEnumSelectedRowKeys(selectedRowKeys);
  };

  /**表格行行为 */
  const handleEnumRow = (record: TEnum) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        if (enumSelectedRowKeys.includes(record.idEnum)) {
          setEnumSelectedRowKeys(
            enumSelectedRowKeys.filter((k) => k !== record.idEnum),
          );
        } else {
          setEnumSelectedRowKeys([...enumSelectedRowKeys, record.idEnum]);
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
      <Modal
        width={'1400px'}
        title={'选择待移入实体'}
        open={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            height: '600px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '20%',
              overflow: 'auto',
            }}
          >
            <Tree
              disabled={
                entitySelectedRowKeys.length + enumSelectedRowKeys.length > 0
              }
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onSelect={handleSelect}
              onExpand={handleExpand}
              treeData={treeDatas}
              titleRender={(nodeData) => {
                return (
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      textDecorationLine:
                        nodeData.id === props.idCollection
                          ? 'line-through'
                          : undefined,
                      cursor:
                        nodeData.id === props.idCollection
                          ? 'not-allowed'
                          : undefined,
                    }}
                  >
                    {nodeData.displayName}
                  </span>
                );
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '70%',
              overflow: 'auto',
            }}
          >
            <Space>
              <span>搜索：</span>
              <Input
                size={'small'}
                placeholder="请输入"
                value={searchValue}
                onChange={handleChange}
              />
            </Space>
            <Tabs onChange={onTabChange}>
              <Tabs.TabPane
                key={'entity'}
                tab={'实体'}
                disabled={enumSelectedRowKeys.length > 0}
              >
                <div
                  style={{
                    marginBottom: '5px',
                  }}
                >
                  <span>
                    总共
                    <span
                      style={{
                        color: 'blue',
                        margin: '0px 5px',
                        fontSize: '18px',
                      }}
                    >
                      {coll?.entities.length ?? 0}
                    </span>
                    条目，
                  </span>
                  <span>
                    筛选出
                    <span
                      style={{
                        color: 'blue',
                        margin: '0px 5px',
                        fontSize: '18px',
                      }}
                    >
                      {entityTableDatas.length ?? 0}
                    </span>
                    条目，
                  </span>
                  <span>
                    已选择
                    <span
                      style={{
                        color: 'blue',
                        margin: '0px 5px',
                        fontSize: '18px',
                      }}
                    >
                      {entitySelectedRowKeys.length}
                    </span>
                    条目
                  </span>
                  <Button
                    size={'small'}
                    type={'primary'}
                    style={{ margin: '0px 5px' }}
                    disabled={entitySelectedRowKeys.length === 0}
                    onClick={() => setEntitySelectedRowKeys([])}
                  >
                    清空
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Table
                    size={'small'}
                    scroll={{ y: 400 }}
                    rowKey={'idEntity'}
                    bordered
                    columns={columns}
                    dataSource={entityTableDatas}
                    pagination={false}
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: entitySelectedRowKeys,
                      onChange: handleEntitySelectRowChange,
                    }}
                    onRow={handleEntityRow}
                  />
                  <Divider type="vertical" style={{ height: 'auto' }} />
                  <Table
                    size={'small'}
                    scroll={{ y: 400 }}
                    rowKey={'idEntity'}
                    bordered
                    pagination={false}
                    dataSource={coll?.entities.filter((t) =>
                      entitySelectedRowKeys.includes(t.idEntity),
                    )}
                    columns={[
                      ...columns.slice(1),
                      {
                        key: 'action',
                        title: '操作',
                        render: (_, record) => (
                          <Button
                            size={'small'}
                            onClick={() => {
                              if (
                                entitySelectedRowKeys.includes(record.idEntity)
                              ) {
                                setEntitySelectedRowKeys(
                                  entitySelectedRowKeys.filter(
                                    (k) => k !== record.idEntity,
                                  ),
                                );
                              } else {
                                setEntitySelectedRowKeys([
                                  ...entitySelectedRowKeys,
                                  record.idEntity,
                                ]);
                              }
                            }}
                          >
                            移除
                          </Button>
                        ),
                      },
                    ]}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                key={'ddEnum'}
                tab={'枚举'}
                disabled={entitySelectedRowKeys.length > 0}
              >
                <div
                  style={{
                    marginBottom: '5px',
                  }}
                >
                  <span>
                    总共
                    <span
                      style={{
                        color: 'blue',
                        margin: '0px 5px',
                        fontSize: '18px',
                      }}
                    >
                      {coll?.enums.length ?? 0}
                    </span>
                    条目，
                  </span>
                  <span>
                    筛选出
                    <span
                      style={{
                        color: 'blue',
                        margin: '0px 5px',
                        fontSize: '18px',
                      }}
                    >
                      {enumTableDatas.length ?? 0}
                    </span>
                    条目，
                  </span>
                  <span>
                    已选择
                    <span
                      style={{
                        color: 'blue',
                        margin: '0px 5px',
                        fontSize: '18px',
                      }}
                    >
                      {enumSelectedRowKeys.length}
                    </span>
                    条目
                  </span>
                  <Button
                    size={'small'}
                    type={'primary'}
                    style={{ margin: '0px 5px' }}
                    disabled={enumSelectedRowKeys.length === 0}
                    onClick={() => setEntitySelectedRowKeys([])}
                  >
                    清空
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Table
                    size={'small'}
                    scroll={{ y: 400 }}
                    rowKey={'idEnum'}
                    bordered
                    columns={enumColumns}
                    dataSource={enumTableDatas}
                    pagination={false}
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: enumSelectedRowKeys,
                      onChange: handleEnumSelectRowChange,
                    }}
                    onRow={handleEnumRow}
                  />
                  <Divider type="vertical" style={{ height: 'auto' }} />
                  <Table
                    size={'small'}
                    scroll={{ y: 400 }}
                    rowKey={'idEnum'}
                    bordered
                    pagination={false}
                    dataSource={coll?.enums.filter((t) =>
                      enumSelectedRowKeys.includes(t.idEnum),
                    )}
                    columns={[
                      ...enumColumns.slice(1),
                      {
                        key: 'action',
                        title: '操作',
                        render: (_, record) => (
                          <Button
                            size={'small'}
                            onClick={() => {
                              if (enumSelectedRowKeys.includes(record.idEnum)) {
                                setEnumSelectedRowKeys(
                                  enumSelectedRowKeys.filter(
                                    (k) => k !== record.idEnum,
                                  ),
                                );
                              } else {
                                setEnumSelectedRowKeys([
                                  ...enumSelectedRowKeys,
                                  record.idEnum,
                                ]);
                              }
                            }}
                          >
                            移除
                          </Button>
                        ),
                      },
                    ]}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SelectEntity;
