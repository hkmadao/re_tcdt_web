import {
  andLogicNode,
  equalFilterNode,
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TPageInfo,
  TPageInfoInput,
} from '@/models';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import {
  Button,
  Col,
  Input,
  InputRef,
  message,
  Modal,
  Row,
  Space,
  Table,
  TableColumnType,
} from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TQueryContent } from '@/pages/Factory/Units/Query/model';
import API from '@/pages/Factory/Units/Query/api';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  actions,
  selectCurrentLayout,
  selectModuleData,
} from '../../../../store';
import ComponentTree from '../../../../../common/ComponentTree';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';

const fillTreeKey = (treeDatas?: TTree[]) => {
  if (!treeDatas) {
    return;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    t.key = t.id!;
    fillTreeKey(t.children);
  }
};

const SearchComp: FC = () => {
  const currentLayout = useSelector(selectCurrentLayout);
  const moduleData = useSelector(selectModuleData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [billformTableData, setBillformTableData] = useState<TQueryContent[]>(
    [],
  );
  const [selectIdComponent, setSelectIdComponent] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>();
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const inputDisplayRef = useRef<InputRef>(null);
  const searchRef = useRef<InputRef>(null);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleComponentSelect = (nodeData?: TCompUpTreeInfo) => {
    if (nodeData) {
      fetchBillForm(nodeData.idComponent, undefined);
    }
  };

  /**获取表单模板 */
  const fetchBillForm = (
    idComponent: string | undefined,
    search: string | undefined,
    page?: number,
    pageSize?: number,
  ) => {
    setSearchValue(search);
    setSelectIdComponent(idComponent);
    let param: TPageInfoInput = {};
    if (idComponent) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([
          equalFilterNode('idComponent', stringFilterParam(idComponent)),
          equalFilterNode(
            'idSubProject',
            stringFilterParam(moduleData.idSubProject!),
          ),
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
            likeFullFilterNode('name', stringFilterParam(search ?? '')),
            likeFullFilterNode('displayName', stringFilterParam(search ?? '')),
            equalFilterNode(
              'idSubProject',
              stringFilterParam(moduleData.idSubProject!),
            ),
          ])(),
        ),
      };
      //搜索框有值，需要置空左树节点数据
      setSelectedRowKeys([]);
      setSelectIdComponent(undefined);
    }
    if (param.logicNode) {
      API.getBillForm(param).then((pageData: TPageInfo<TQueryContent>) => {
        setPageIndex(pageData.pageInfoInput.pageIndex || 1);
        setPageSize(pageData.pageInfoInput.pageSize || 10);
        setTotal(pageData.pageInfoInput.totalCount || 0);
        if (pageData.dataList) {
          setBillformTableData(pageData.dataList);
          return;
        }
        setBillformTableData([]);
      });
    }
  };

  const handleSearch = () => {
    fetchBillForm(undefined, searchRef.current?.input?.value);
  };

  /**点击选择组件 */
  const handleToSelectComponent = () => {
    setSelectIdComponent(undefined);
    setBillformTableData([]);
    setSelectedRowKeys(
      currentLayout?.component?.idRef ? [currentLayout?.component?.idRef] : [],
    );
    setModalVisible(true);
  };

  /**点击配置表单 */
  const handleConfBillform = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warn('请先选择表单模板！');
      return;
    }
    const billform = billformTableData.find(
      (billform) => billform.idQuery === selectedRowKeys[0],
    );
    if (!billform) {
      message.warn('找不到对应表单模板！');
      return;
    }
    if (currentLayout) {
      dispatch(
        actions.updateLayout({
          ...currentLayout,
          component: {
            componentType: currentLayout.component?.componentType!,
            idRef: billform.idQuery!,
            name: billform.displayName!,
          },
        }),
      );
    }
    setModalVisible(false);
  };

  const handleClear = () => {
    setSelectIdComponent(undefined);
    if (currentLayout) {
      dispatch(
        actions.updateLayout({
          ...currentLayout,
          component: {
            componentType: currentLayout.component?.componentType!,
            idRef: undefined,
            name: undefined,
          },
        }),
      );
    }
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const onPageChange = (page: number, pageSize: number) => {
    fetchBillForm(selectIdComponent, searchValue, page, pageSize);
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const columns: TableColumnType<TQueryContent>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: '200px',
      render: (value: any, record: TQueryContent, index: number) => {
        return <span>{record.name}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      width: '200px',
      render: (value: any, record: TQueryContent, index: number) => {
        return <span>{record.displayName}</span>;
      },
    },
  ];

  const onRow = (record: TQueryContent) => {
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record.idQuery!]);
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleSelect = (
    record: TQueryContent,
    select: boolean,
    selectedRows: TQueryContent[],
  ) => {
    setSelectedRowKeys([record.idQuery!]);
  };

  return (
    <>
      <span>
        <Input
          ref={inputDisplayRef}
          value={currentLayout?.component?.name}
          readOnly
          placeholder={'请选择'}
          suffix={
            <Space direction="horizontal" size={2}>
              {currentLayout?.component?.name ? (
                <CloseOutlined onClick={handleClear} />
              ) : (
                ''
              )}
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
      </span>
      <Modal
        title="选择组件"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleConfBillform}
        width={'800px'}
      >
        <div style={{ height: '500px', overflow: 'auto' }}>
          <Row>
            <Col span={8} style={{}}>
              <div style={{ height: '500px', overflow: 'auto' }}>
                <ComponentTree
                  fgLoadData={modalVisible}
                  idSubProject={moduleData.idSubProject}
                  idTreeSelected={moduleData.idComponent}
                  idSelected={currentLayout?.component?.idRef}
                  handleSelect={handleComponentSelect}
                />
              </div>
            </Col>
            <Col span={16}>
              <div style={{ height: '450px', overflow: 'auto' }}>
                <Space direction={'vertical'} size={'small'}>
                  <Space direction={'horizontal'} size={5}>
                    <Input
                      disabled={!!selectIdComponent}
                      size={'small'}
                      ref={searchRef}
                    />
                    <Button
                      size={'small'}
                      onBlur={handleSearch}
                      onClick={handleSearch}
                      disabled={!!selectIdComponent}
                      type={'primary'}
                    >
                      <SearchOutlined />
                    </Button>
                  </Space>
                  <Table
                    rowKey={'idQuery'}
                    bordered={true}
                    size={'small'}
                    columns={columns}
                    dataSource={billformTableData}
                    onRow={onRow}
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys,
                      onChange: setSelectedRowKeys,
                      onSelect: handleSelect,
                    }}
                    pagination={{
                      total: total,
                      current: pageIndex,
                      pageSize: pageSize,
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

export default SearchComp;
