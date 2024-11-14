import { FC, Key, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Button,
  Table,
  Tree,
  TableColumnsType,
  Tabs,
  Input,
  Space,
  InputRef,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  andLogicNode,
  equalFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';
import { selectEntityCollection } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import TreeAPI from '@/pages/ComponentDTO/ComponentDTOTree/api';
import {
  TEntity,
  TEntityCollection,
  TEnum,
} from '@/pages/DescriptData/DescriptDesign/models';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { fillTreeKey } from '@/util';
import { EnumTreeNodeType } from '@/pages/DescriptData/DescriptTree/conf';

type TProps = {
  entityType: 'entity' | 'enum';
  value?: TEntity;
  onChange?: any;
};

const ReConnEntity: FC<TProps> = ({ entityType, value, onChange }) => {
  const dispatch = useDispatch();
  const dtoEntityCollection = useSelector(selectEntityCollection);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeDatas, setTreeDatas] = useState<TTree[]>([]);
  const [interValue, setInterValue] = useState<any>();
  const inputDisplayRef = useRef<InputRef>(null);

  const [entitySelectedRowKeys, setEntitySelectedRowKeys] = useState<Key[]>();
  const [enumSelectedRowKeys, setEnumSelectedRowKeys] = useState<Key[]>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [coll, setColl] = useState<TEntityCollection>();

  const { entityTableDatas, enumTableDatas } = ((coll, searchValue) => {
    const result: { entityTableDatas: any[]; enumTableDatas: any[] } = {
      entityTableDatas: [],
      enumTableDatas: [],
    };
    if (coll) {
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
    if (value) {
      setInterValue(value.displayName);
      return;
    }
    setInterValue(undefined);
  }, [value]);

  const handleClear = () => {
    setInterValue(undefined);
    onChange(undefined);
  };

  const fetchProjectTree = () => {
    const idProject = dtoEntityCollection?.dtoModule?.subProject?.idProject;
    if (dtoEntityCollection && idProject) {
      const params: TCondition = {
        logicNode: andLogicNode([
          equalFilterNode('idProject', stringFilterParam(idProject)),
        ])(),
      };
      TreeAPI.entityProjectTree(params).then((res: TTree[]) => {
        if (res) {
          const formatedTreeData = fillTreeKey(res);
          setTreeDatas(formatedTreeData);
        }
      });
    }
  };

  const handleTreeClick = (idEntityCollection: string) => {
    return () => {
      setSearchValue(undefined);
      setEntitySelectedRowKeys([]);
      setEnumSelectedRowKeys([]);
      TreeAPI.getSimpleCollection({
        idEntityCollection: idEntityCollection,
      }).then((resEntityCollection: TEntityCollection) => {
        if (resEntityCollection) {
          setColl(resEntityCollection);
        }
      });
    };
  };

  const handleOpenModal = () => {
    setSearchValue(undefined);
    setEntitySelectedRowKeys([]);
    setEnumSelectedRowKeys([]);
    setSelectedKeys([]);
    setExpandedKeys([]);
    fetchProjectTree();
    setModalVisible(true);
  };

  const handleOk = async () => {
    if (
      entityType === 'entity' &&
      entitySelectedRowKeys &&
      entitySelectedRowKeys.length > 0
    ) {
      const enti = entityTableDatas?.find((enti) =>
        entitySelectedRowKeys.includes(enti.idEntity),
      );
      if (enti) {
        onChange(enti);
      }
      setModalVisible(false);
      return;
    }
    const ddEnum = enumTableDatas?.find((enti) =>
      enumSelectedRowKeys?.includes(enti.idEnum),
    );
    if (ddEnum) {
      onChange(ddEnum);
    }
    setModalVisible(false);
  };

  const onTabChange = async (tableKey: string) => {
    setEntitySelectedRowKeys([]);
    setEnumSelectedRowKeys([]);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const columns: TableColumnsType<TEntity> = [
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

  const enumColumns: TableColumnsType<TEnum> = [
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

  const handleSelect = (keys: Key[], { node }: { node: TTree }) => {
    if (!keys.includes(node.id!)) {
      setSelectedKeys([...keys, node.id!]);
    } else {
      setSelectedKeys(keys);
    }
    toggleExpand(node.id!);
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

  const handleChange = (e: any) => {
    setSearchValue(e.currentTarget.value);
  };

  return (
    <>
      <Input
        ref={inputDisplayRef}
        value={interValue}
        readOnly
        placeholder={'请选择'}
        suffix={
          <Space direction="horizontal" size={2}>
            {interValue ? <CloseOutlined onClick={handleClear} /> : ''}
            <Button size="small" type="primary" onClick={handleOpenModal}>
              <SearchOutlined />
            </Button>
          </Space>
        }
      />
      <Modal
        width={'700px'}
        title={'选择待增加实体'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            height: '550px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '30%',
              overflow: 'auto',
            }}
          >
            <Tree
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onSelect={handleSelect}
              onExpand={handleExpand}
              treeData={treeDatas}
              titleRender={(nodeData) => {
                if (nodeData.level === EnumTreeNodeType.ENTITY_COLLECTION) {
                  return (
                    <span
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={handleTreeClick(nodeData.id!)}
                    >
                      {nodeData.displayName}
                    </span>
                  );
                }
                return (
                  <span style={{ whiteSpace: 'nowrap' }}>
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
              <Tabs.TabPane key={'entity'} tab={'实体'}>
                <Table
                  size={'small'}
                  scroll={{ y: 400 }}
                  rowKey={'idEntity'}
                  bordered
                  columns={columns}
                  dataSource={entityTableDatas}
                  pagination={false}
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: entitySelectedRowKeys,
                    onChange: setEntitySelectedRowKeys,
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key={'ddEnum'} tab={'枚举'}>
                <Table
                  size={'small'}
                  scroll={{ y: 400 }}
                  rowKey={'idEnum'}
                  bordered
                  columns={enumColumns}
                  dataSource={enumTableDatas}
                  pagination={false}
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: enumSelectedRowKeys,
                    onChange: setEnumSelectedRowKeys,
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReConnEntity;
