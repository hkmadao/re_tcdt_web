import {
  andLogicNode,
  equalFilterNode,
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TPageInfoInput,
} from '@/models';
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
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  actions,
  selectCurrentLayout,
  selectModuleData,
} from '../../../../store';
import ModuleAPI from '@/pages/Factory/Units/Action/api';
import { TAction } from '@/pages/Factory/Units/Action/model';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';
import ComponentTree from '@/pages/Factory/common/ComponentTree';

const ActionComp: FC = () => {
  const currentLayout = useSelector(selectCurrentLayout);
  const moduleData = useSelector(selectModuleData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TAction[]>([]);
  const [selectedIdProject, setSelectIdProject] = useState<string>();
  const [selectedIdSubProject, setSelectIdSubProject] = useState<string>();
  const [selectIdComponentModule, setSelectIdComponentModule] =
    useState<string>();
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
      fetchData(
        nodeData.idProject,
        nodeData.idSubProject,
        nodeData.idComponentModule,
        nodeData.idComponent,
        undefined,
      );
    }
  };

  /**获取表单模板 */
  const fetchData = (
    idProject: string | undefined,
    idSubProject: string | undefined,
    idComponentModule: string | undefined,
    idComponent: string | undefined,
    search: string | undefined,
    page?: number,
    pageSize?: number,
  ) => {
    setSearchValue(search);
    setSelectIdComponent(idComponent);
    setSelectIdComponentModule(idComponentModule);
    setSelectIdSubProject(idSubProject);
    setSelectIdProject(idProject);
    let param: TPageInfoInput = {};

    if (search && search.trim() !== '') {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([])(
          orLogicNode([
            likeFullFilterNode('name', stringFilterParam(search ?? '')),
            likeFullFilterNode('displayName', stringFilterParam(search ?? '')),
          ])(),
        ),
      };
      //搜索框有值，需要置空左树节点数据
      setSelectedRowKeys([]);
      setSelectIdComponent(undefined);
      setSelectIdComponentModule(undefined);
      setSelectIdSubProject(undefined);
      setSelectIdProject(undefined);
    } else if (idComponent) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([
          equalFilterNode('idComponent', stringFilterParam(idComponent)),
        ])(),
      };
    } else if (idComponentModule) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([
          equalFilterNode(
            'idComponentModule',
            stringFilterParam(idComponentModule),
          ),
        ])(),
      };
    } else if (idSubProject) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([
          equalFilterNode('idSubProject', stringFilterParam(idSubProject)),
        ])(),
      };
    } else if (idProject) {
      param = {
        pageIndex: page ? page : 1,
        pageSize: pageSize ? pageSize : 10,
        logicNode: andLogicNode([
          equalFilterNode('idProject', stringFilterParam(idProject)),
        ])(),
      };
    }
    if (param.logicNode) {
      ModuleAPI.getAction(param).then((pageData) => {
        setPageIndex(pageData.pageInfoInput.pageIndex || 1);
        setPageSize(pageData.pageInfoInput.pageSize || 10);
        setTotal(pageData.pageInfoInput.totalCount || 0);
        if (pageData.dataList) {
          setTableData(pageData.dataList);
          return;
        }
        setTableData([]);
      });
    }
  };

  const handleSearch = () => {
    fetchData(
      undefined,
      undefined,
      undefined,
      undefined,
      searchRef.current?.input?.value,
    );
  };

  /**点击选择组件 */
  const handleToSelectComponent = () => {
    setSelectIdSubProject(undefined);
    setTableData([]);
    setSelectedRowKeys(
      currentLayout?.component?.idRef ? [currentLayout?.component?.idRef] : [],
    );
    setModalVisible(true);
  };

  /**点击配置表单 */
  const handleConfBillform = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warn('请先选择树模板！');
      return;
    }
    const billform = tableData.find(
      (billform) => billform.idButtonAction === selectedRowKeys[0],
    );
    if (!billform) {
      message.warn('找不到对应树模板！');
      return;
    }
    if (currentLayout) {
      dispatch(
        actions.updateLayout({
          ...currentLayout,
          component: {
            componentType: currentLayout.component?.componentType!,
            idRef: billform.idButtonAction!,
            name: billform.displayName!,
          },
        }),
      );
    }
    setModalVisible(false);
  };

  const handleClear = () => {
    setSelectIdSubProject(undefined);
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
    fetchData(
      selectedIdProject,
      selectedIdSubProject,
      selectIdComponentModule,
      selectIdComponent,
      searchValue,
      page,
      pageSize,
    );
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const columns: TableColumnType<TAction>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: '200px',
      render: (value: any, record: TAction, index: number) => {
        return <span>{record.name}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      width: '200px',
      render: (value: any, record: TAction, index: number) => {
        return <span>{record.displayName}</span>;
      },
    },
  ];

  const onRow = (record: TAction) => {
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record.idButtonAction!]);
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleSelect = (
    record: TAction,
    select: boolean,
    selectedRows: TAction[],
  ) => {
    setSelectedRowKeys([record.idButtonAction!]);
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
        title="选择树组件"
        maskClosable={false}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleConfBillform}
        width={'800px'}
        destroyOnClose={true}
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
                      disabled={!!selectedIdSubProject}
                      size={'small'}
                      ref={searchRef}
                    />
                    <Button
                      size={'small'}
                      onBlur={handleSearch}
                      onClick={handleSearch}
                      disabled={!!selectedIdSubProject}
                      type={'primary'}
                    >
                      <SearchOutlined />
                    </Button>
                  </Space>
                  <Table
                    rowKey={'idButtonAction'}
                    bordered={true}
                    size={'small'}
                    columns={columns}
                    dataSource={tableData}
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

export default ActionComp;
