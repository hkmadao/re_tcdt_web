import React, { FC, Key, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Tree,
  Table,
  TableColumnType,
  message,
  Tooltip,
  Space,
  Input,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DOStatus } from '@/models/enums';
import { actions, selectEntityComponent } from '../../../store';
import TreeAPI from '@/pages/DescriptData/DescriptTree/api';
import API from '@/pages/DescriptData/DescriptDesign/api';
import {
  andLogicNode,
  equalFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';
import {
  TEntityCollection,
  TEnum,
} from '@/pages/ComponentData/ComponentDesign/models';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';
import { EnumTreeNodeType } from '@/pages/DescriptData/DescriptTree/conf';
import { BorderInnerOutlined } from '@ant-design/icons';
import { fillTreeKey } from '@/util';

const AddComponenEnum: FC = () => {
  const [buttonDisabeld, setButtonDisabeld] = useState<boolean>(true);
  const component = useSelector(selectEntityComponent);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [treeDatas, setTreeDatas] = useState<TTree[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [coll, setColl] = useState<TEntityCollection>();

  const { tableDatas } = ((coll, searchValue) => {
    const existIds =
      component.componentEnums
        ?.filter((ce) => ce.action !== DOStatus.DELETED)
        ?.map((ce) => {
          return ce.idEnum;
        }) || [];
    const result: { tableDatas: any[] } = { tableDatas: [] };
    if (coll) {
      if (coll.enums) {
        if (searchValue && searchValue.trim()) {
          const enumTableData = coll.enums
            .filter((enti) => !existIds.includes(enti.idEnum))
            .filter((enti) => {
              return (
                enti.className?.includes(searchValue) ||
                enti.displayName?.includes(searchValue)
              );
            });
          result.tableDatas = enumTableData;
        } else {
          result.tableDatas = coll.enums;
        }
      }
    }
    return result;
  })(coll, searchValue);

  const fetchData: () => void = () => {
    if (!component.componentModule?.idSubProject) {
      return;
    }
    const idSubProject = component.componentModule.idSubProject;
    const param: TCondition = {
      logicNode: andLogicNode([
        equalFilterNode(
          'subProjects.idSubProject',
          stringFilterParam(idSubProject ?? ''),
        ),
      ])(),
    };
    TreeAPI.entityProjectTree(param).then((res: TTree[]) => {
      if (res) {
        const formatedTreeData = fillTreeKey(res);
        setTreeDatas(formatedTreeData);
        if (formatedTreeData.length > 0) {
          setExpandedKeys([formatedTreeData[0].id!]);
        }
      }
    });
  };

  const columns: TableColumnType<TEnum>[] = [
    {
      dataIndex: 'className',
      title: '类名称',
      render: (value: any, record: TEnum, index: number) => {
        return <span>{record.className}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      render: (value: any, record: TEnum, index: number) => {
        return <span>{record.displayName}</span>;
      },
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

  const handleTreeClick = (idEntityCollection: string) => {
    return () => {
      setSearchValue(undefined);
      setSelectedRowKeys([]);
      TreeAPI.getSimpleCollection({
        idEntityCollection: idEntityCollection,
      }).then((resEntityCollection: TEntityCollection) => {
        if (resEntityCollection) {
          setColl(resEntityCollection);
        }
      });
    };
  };

  useEffect(() => {
    if (component?.idComponent) {
      const ces =
        component.componentEntities?.filter(
          (componentEntity) => componentEntity.action !== DOStatus.DELETED,
        ) || [];
      if (ces.length > 0) {
        setButtonDisabeld(true);
      } else {
        setButtonDisabeld(false);
      }
    } else {
      setButtonDisabeld(true);
    }
  }, [component]);

  /**点击添加枚举 */
  const handleToAddEntity = () => {
    setSearchValue(undefined);
    setSelectedRowKeys([]);
    setSelectedKeys([]);
    setExpandedKeys([]);
    setColl(undefined);
    fetchData();
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认添加枚举 */
  const handleAddEntity = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warn('请先选择枚举！');
      return;
    }
    API.getDetailByEnumIds({ idEnumList: selectedRowKeys.join(',') }).then(
      (resEnums: TEnum[]) => {
        if (resEnums) {
          dispatch(actions.addComponentEnums(resEnums));
          setModalVisible(false);
        }
      },
    );
  };

  const handleSelectRowChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**表格行行为 */
  const onRow = (record: TEnum) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        if (selectedRowKeys.includes(record.idEnum)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((k) => k !== record.idEnum),
          );
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.idEnum]);
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
      <Tooltip overlay={'添加枚举'}>
        <Button
          size={'small'}
          onClick={handleToAddEntity}
          disabled={buttonDisabeld}
          icon={<BorderInnerOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        title="选择枚举"
        maskClosable={false}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAddEntity}
        width={'800px'}
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
            <Table
              size={'small'}
              scroll={{ y: 400 }}
              rowKey={'idEnum'}
              bordered
              columns={columns}
              dataSource={tableDatas}
              pagination={false}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedRowKeys,
                onChange: handleSelectRowChange,
              }}
              onRow={onRow}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddComponenEnum;
