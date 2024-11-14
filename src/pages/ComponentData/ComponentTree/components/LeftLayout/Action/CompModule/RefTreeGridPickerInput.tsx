import { FC, Key, useEffect, useRef, useState } from 'react';
import {
  Input,
  Table,
  TableColumnType,
  Space,
  Modal,
  Button,
  InputRef,
  Tree,
} from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import * as API from '@/api';
import {
  TBillRef,
  TBillTreeRef,
  TCondition,
  TPageInfoInput,
  TTree,
} from '@/models';
import { TEntityCollection } from '@/pages/DescriptData/DescriptDesign/models';
import { EnumTreeNodeType } from '@/pages/DescriptData/DescriptTree/conf';

type TRefTreeGridPickerInputProps = {
  value?: any;
  onChange?: any;
  getSelectTreeNodeId?: (treeNode: TTree) => string;
  billRef: TBillRef;
  entityType: 'agg' | 'entity' | 'enum';
  selectEntityCallBack: (
    data: any,
    entityType: 'agg' | 'entity' | 'enum',
  ) => void;
  resetInputVaule: number;
};

const treeDataSet = (billTreeRef: TBillTreeRef, treeDatas: (TTree | any)[]) => {
  if (!treeDatas || treeDatas.length === 0) {
    return;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    treeDatas[i].key = treeDatas[i][billTreeRef.keyAttr!];
    treeDatas[i].id = treeDatas[i][billTreeRef.keyAttr!];
    treeDatas[i].title = treeDatas[i][billTreeRef.labelAttr!];
    treeDataSet(billTreeRef, treeDatas[i].children);
  }
};

const getTreeDatas = (
  uri: string,
  methodType: 'POST' | 'GET',
  params?: TCondition,
) => {
  if (methodType === 'POST') {
    return API.POST(uri, params);
  }
  return API.GET(uri, params);
};

const getTableDatas = (
  uri: string,
  methodType: 'POST' | 'GET',
  params?: TCondition,
) => {
  if (methodType === 'POST') {
    return API.POST(uri, params);
  }
  return API.GET(uri, params);
};

const RefTreeGridPickerInput: FC<TRefTreeGridPickerInputProps> = ({
  value,
  onChange,
  getSelectTreeNodeId,
  entityType,
  selectEntityCallBack,
  resetInputVaule,
  ...props
}) => {
  const { backWriteProp, displayProp, title, tableRef, billTreeRef } =
    props.billRef;

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [interValue, setInterValue] = useState<any>();
  const inputDisplayRef = useRef<InputRef>(null);
  const [treeData, setTreeData] = useState<TTree[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [tableSearchValue, setTableSearchValue] = useState<string>();
  const [coll, setColl] = useState<TEntityCollection>();

  const { tableDatas, pageInfo } = ((coll, tableSearchValue) => {
    const result: { tableDatas: any[]; pageInfo: TPageInfoInput } = {
      tableDatas: [],
      pageInfo: { totalCount: 0, pageIndex: 1, pageSize: 10 },
    };
    if (coll) {
      if (entityType !== 'enum') {
        if (coll.entities) {
          if (tableSearchValue && tableSearchValue.trim()) {
            const entityTableData = coll.entities.filter((enti) => {
              return (
                enti.tableName?.includes(tableSearchValue) ||
                enti.className?.includes(tableSearchValue) ||
                enti.displayName?.includes(tableSearchValue)
              );
            });
            result.tableDatas = entityTableData;
            result.pageInfo = {
              totalCount: entityTableData.length,
              pageIndex: 1,
              pageSize: entityTableData.length,
            };
          } else {
            result.tableDatas = coll.entities;
            result.pageInfo = {
              totalCount: coll.entities.length,
              pageIndex: 1,
              pageSize: coll.entities.length,
            };
          }
        }
      } else {
        if (coll.enums) {
          if (tableSearchValue && tableSearchValue.trim()) {
            const entityTableData = coll.enums.filter((enti) => {
              return (
                enti.className?.includes(tableSearchValue) ||
                enti.displayName?.includes(tableSearchValue)
              );
            });
            result.tableDatas = entityTableData;
            result.pageInfo = {
              totalCount: entityTableData.length,
              pageIndex: 1,
              pageSize: entityTableData.length,
            };
          } else {
            result.tableDatas = coll.enums;
            result.pageInfo = {
              totalCount: coll.enums.length,
              pageIndex: 1,
              pageSize: coll.enums.length,
            };
          }
        }
      }
    }
    return result;
  })(coll, tableSearchValue);

  useEffect(() => {
    if (resetInputVaule) {
      setInterValue(undefined);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setSelectedKeys([]);
    }
  }, [resetInputVaule]);

  const fetchTreeDatas = async () => {
    const treeDatas: (TTree | any)[] = await getTreeDatas(
      billTreeRef?.uri!,
      billTreeRef?.method || 'GET',
      billTreeRef?.methodParams,
    );
    treeDataSet(billTreeRef!, treeDatas);
    setTreeData(treeDatas);
  };

  const fetchTableDatas = (idTreeNode?: string) => {
    let params: any = {};
    if (tableRef?.treeRefMainKey && idTreeNode) {
      params[tableRef.treeRefMainKey] = idTreeNode;
    }
    getTableDatas(tableRef?.dataUri!, 'GET', params).then(
      (data: TEntityCollection) => {
        if (data) {
          setColl(data);
        }
      },
    );
  };

  useEffect(() => {
    if (value) {
      setInterValue(value[displayProp!]);
    }
  }, [value]);

  const handleSearch = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSelectedKeys([]);
    setTableSearchValue(undefined);
    setColl(undefined);
    fetchTreeDatas();
    setIsModalVisible(true);
  };

  const handleClear = () => {
    /**清空显示的值 */
    setInterValue(undefined);

    if (onChange) {
      //editTable必须要触发表单修改，否则修改不会更新到table模式
      onChange(undefined);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onPageChange = (page: number, pageSize: number) => {};

  const handleOk = async () => {
    if (onChange) {
      //editTable必须要触发表单修改，否则修改不会更新到table模式
      onChange(selectedRows[0]);
    }
    //设置显示的值
    setInterValue(selectedRows[0][displayProp!]);
    selectEntityCallBack(selectedRows[0], entityType);
    setIsModalVisible(false);
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const columns: TableColumnType<any>[] = [];
  tableRef?.refColumns?.forEach((columConfig) => {
    columns.push({
      title: columConfig.displayName,
      dataIndex: columConfig.name,
      key: columConfig.name,
      render: (text: string) => <a>{text ? text : '--'}</a>,
    });
  });

  const handleSelectRowChange = (
    selectedRowKeys: Key[],
    selectedRows: any[],
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  /**表格行行为 */
  const onRow = (record: any) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record[backWriteProp!]!]);
        setSelectedRows([record]);
      }, // 点击行
      onDoubleClick: (event: any) => {
        //双击行选中结果
        setSelectedRowKeys([record[backWriteProp!]!]);
        setSelectedRows([record]);
        handleOk();
      },
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const toggleExpand = (key: Key) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter((e) => e !== key));
      return;
    }

    setExpandedKeys([...expandedKeys, key]);
  };

  const handleChange = (e: any) => {
    setTableSearchValue(e.currentTarget.value);
  };

  const handleSelect = (keys: React.Key[], { node }: { node: TTree }) => {
    if (!keys.includes(node.id!)) {
      setSelectedKeys([...keys, node.id!]);
    } else {
      setSelectedKeys(keys);
    }
    toggleExpand(node.id!);
    setSelectedRowKeys([]);
    if (node.level !== EnumTreeNodeType.ENTITY_COLLECTION) {
      return;
    }
    if (getSelectTreeNodeId) {
      const treeNodeId = getSelectTreeNodeId(node);
      fetchTableDatas(treeNodeId);
      return;
    }
    fetchTableDatas(keys[0].toString());
  };

  const handleExpand = (keys: Key[], { node }: { node: TTree }) => {
    toggleExpand(node.id!);
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Input
          ref={inputDisplayRef}
          value={interValue}
          readOnly
          placeholder={'请选择'}
          suffix={
            <Space direction="horizontal" size={2}>
              {interValue ? <CloseOutlined onClick={handleClear} /> : ''}
              <Button size="small" type="primary" onClick={handleSearch}>
                <SearchOutlined />
              </Button>
            </Space>
          }
        />
      </Space>
      <Modal
        width={1000}
        title={title}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'row',
            height: '550px',
          }}
        >
          <div style={{ minWidth: 300, overflow: 'auto' }}>
            <Tree
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              expandedKeys={expandedKeys}
              onSelect={handleSelect}
              onExpand={handleExpand}
              treeData={treeData}
              selectedKeys={selectedKeys}
              titleRender={(nodeData) => {
                return (
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {nodeData.displayName}
                  </span>
                );
              }}
            />
          </div>
          <div>
            <Space>
              <span>搜索：</span>
              <Input
                size={'small'}
                placeholder="请输入"
                value={tableSearchValue}
                onChange={handleChange}
              />
            </Space>
            <Table
              scroll={{ x: '200px', y: '300px' }}
              rowKey={backWriteProp}
              columns={columns}
              dataSource={tableDatas}
              size={'small'}
              rowSelection={{
                type: 'radio',
                selectedRowKeys,
                onChange: handleSelectRowChange,
              }}
              onRow={onRow}
              pagination={{
                pageSize: pageInfo?.pageSize,
                total: pageInfo?.totalCount,
                onChange: onPageChange,
                showTotal,
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RefTreeGridPickerInput;
