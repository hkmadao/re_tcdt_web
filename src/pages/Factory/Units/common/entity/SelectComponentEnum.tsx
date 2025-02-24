import {
  andLogicNode,
  equalFilterNode,
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TPageInfo,
  TPageInfoInput,
} from '@/models';
import { EnumTreeNodeType } from '@/pages/ComponentData/ComponentTree/conf';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import {
  Button,
  Col,
  Input,
  InputRef,
  Modal,
  Row,
  Space,
  Table,
  TableColumnType,
  Tree,
} from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ComponentAPI from '@/pages/ComponentData/ComponentTree/api';
import { TComponentEnum } from '@/pages/ComponentData/ComponentDesign/models';
import CommonAPI from '../api';
import { fillTreeKey } from '@/util';

const SelectComponentEnum: FC<{
  filterProjectIds: string[];
  displayName?: string;
  callback: (idComponentEnum: string, ceDisplayName: string) => void;
}> = ({ filterProjectIds: filterCompIds, displayName, callback }) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedTreeKeys, setSelectedTreeKeys] = useState<(string | number)[]>(
    [],
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TTree[]>([]);
  const [componentEntityList, setComponentEnumList] = useState<
    TComponentEnum[]
  >([]);
  const [selectIdComponent, setSelectIdComponent] = useState<string>();
  const [total, setTotal] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>();

  const searchRef = useRef<InputRef>(null);
  const inputDisplayRef = useRef<InputRef>(null);

  useEffect(() => {
    setDisplayValue(displayName);
  }, []);

  /**获取组件树 */
  const fetchData = () => {
    ComponentAPI.componentProjectTree().then((componentTree) => {
      if (componentTree) {
        if (componentTree) {
          const cTreedata = fillTreeKey(componentTree);
          if (filterCompIds && filterCompIds.length > 0) {
            const newTree = (cTreedata as any[]).filter((ct) =>
              filterCompIds.includes(ct.id),
            );
            setTreeData(newTree);
            return;
          }
          setTreeData(cTreedata);
        }
      }
    });
  };

  const onSearch = () => {
    const searchValue = searchRef.current?.input?.value;
    fetchComponentEnum(undefined, searchValue, 1, 10);
  };

  /**获取实体 */
  const fetchComponentEnum = (
    idComponent: string | undefined,
    search: string | undefined,
    page?: number,
    pageSize?: number,
  ) => {
    let param: TPageInfoInput = {};
    if (idComponent) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([
          equalFilterNode('idComponent', stringFilterParam(idComponent)),
        ])(),
      };
    }
    //搜索框的有值，不传树节点条件
    if (!idComponent) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([])(
          orLogicNode([
            likeFullFilterNode(
              'ddEnum.className',
              stringFilterParam(search ?? ''),
            ),
            likeFullFilterNode(
              'ddEnum.displayName',
              stringFilterParam(search ?? ''),
            ),
          ])(),
        ),
      };
    }
    if (param.logicNode) {
      CommonAPI.getCompnentEnumPage(param).then(
        (pageData: TPageInfo<TComponentEnum>) => {
          setTotal(pageData.pageInfoInput.totalCount || 0);
          if (pageData.dataList) {
            setComponentEnumList(pageData.dataList);
            return;
          }
          setComponentEnumList([]);
        },
      );
    }
  };

  /**点击选择组件 */
  const handleToSelectComponent = () => {
    setSelectIdComponent(undefined);
    setComponentEnumList([]);
    setSelectedRowKeys([]);
    setSelectedTreeKeys([]);
    setExpandedKeys([]);
    fetchData();
    setModalVisible(true);
  };

  const onSelect = (keys: React.Key[], { node }: { node: TTree }) => {
    if (node.children && node.children.length > 0) {
      toggleExpand(node.key);
    }
    if (!keys.includes(node.key)) {
      setSelectedTreeKeys([...selectedTreeKeys, node.key]);
    }
    if (node.level === EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION) {
      setSelectIdComponent(node.id);
      fetchComponentEnum(node.id, undefined);
    } else {
      setSelectIdComponent(undefined);
    }
  };

  const toggleExpand = (currentKey: string | number) => {
    if (expandedKeys.includes(currentKey)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== currentKey));
      return;
    }
    setExpandedKeys(expandedKeys.concat([currentKey]));
  };

  const onExpand = (
    keys: React.Key[],
    { node }: { node: TTree; expanded: boolean },
  ) => {
    toggleExpand(node.key);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认选中组件实体 */
  const handleOk = () => {
    const ce = componentEntityList.find((ce) =>
      selectedRowKeys.includes(ce.idComponentEnum),
    );
    callback(ce?.idComponentEnum!, ce?.ddEnum?.displayName!);
    setDisplayValue(ce?.ddEnum?.displayName);
    setModalVisible(false);
  };

  const onPageChange = (page: number, pageSize: number) => {
    const searchValue = searchRef.current?.input?.value;
    fetchComponentEnum(selectIdComponent, searchValue, page, pageSize);
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const columns: TableColumnType<TComponentEnum>[] = [
    {
      dataIndex: 'className',
      title: '类名',
      width: '200px',
      render: (value: any, record: TComponentEnum, index: number) => {
        return <span>{record?.ddEnum?.className}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      width: '200px',
      render: (value: any, record: TComponentEnum, index: number) => {
        return <span>{record?.ddEnum?.displayName}</span>;
      },
    },
  ];

  const titleRender = (nodeData: TTree) => {
    return <span style={{ whiteSpace: 'nowrap' }}>{nodeData.displayName}</span>;
  };

  const onRow = (record: TComponentEnum) => {
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record.idComponentEnum!]);
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleSelect = (
    record: TComponentEnum,
    select: boolean,
    selectedRows: TComponentEnum[],
  ) => {
    setSelectedRowKeys([record.idComponentEnum!]);
  };
  return (
    <>
      <Space size={5}>
        <span>枚举：</span>
        <Input
          size={'small'}
          ref={inputDisplayRef}
          value={displayValue}
          readOnly
          placeholder={'请选择'}
          suffix={
            <Space direction="horizontal" size={2}>
              <Button
                size="small"
                type="primary"
                onClick={handleToSelectComponent}
              >
                <SearchOutlined />
              </Button>
            </Space>
          }
        />
      </Space>
      <Modal
        title="选择组件枚举"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOk}
        width={'800px'}
      >
        <div style={{ height: '500px', overflow: 'auto' }}>
          <Row>
            <Col span={8} style={{}}>
              <div style={{ height: '500px', overflow: 'auto' }}>
                <Tree
                  showLine={{ showLeafIcon: false }}
                  defaultExpandAll
                  onSelect={onSelect}
                  onExpand={onExpand}
                  treeData={treeData}
                  selectedKeys={selectedTreeKeys}
                  expandedKeys={expandedKeys}
                  titleRender={titleRender}
                />
              </div>
            </Col>
            <Col span={16}>
              <Input
                style={{ width: '300px' }}
                size={'small'}
                ref={searchRef}
              />
              <Button
                size={'small'}
                onBlur={onSearch}
                onClick={onSearch}
                type={'primary'}
              >
                <SearchOutlined />
              </Button>
              <div style={{ height: '450px', overflow: 'auto' }}>
                <Space direction={'vertical'} size={5}>
                  <Table
                    rowKey={'idComponentEnum'}
                    bordered={true}
                    size={'small'}
                    columns={columns}
                    dataSource={componentEntityList}
                    onRow={onRow}
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys,
                      onChange: setSelectedRowKeys,
                      onSelect: handleSelect,
                    }}
                    pagination={{
                      total: total,
                      onChange: onPageChange,
                      showTotal,
                    }}
                  />
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default SelectComponentEnum;
