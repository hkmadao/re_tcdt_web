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
  Checkbox,
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
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TBillForm, TBillFormContent } from '@/pages/Factory/Units/Form/model';
import API from '@/pages/Factory/Units/Form/api';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  actions,
  selectCurrentLayout,
  selectModuleData,
} from '../../../../store';
import ComponentTree from '@/pages/Factory/common/ComponentTree';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';
import { getModuleTypes } from '@/pages/Factory/common/utils';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

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

const BillformComp: FC = () => {
  const currentLayout = useSelector(selectCurrentLayout);
  const moduleData = useSelector(selectModuleData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fgImportModel, setFgImportModel] = useState<boolean>(false);
  const [billformTableData, setBillformTableData] = useState<TBillForm[]>([]);
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
      API.getBillForm(param).then((pageData: TPageInfo<TBillForm>) => {
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
      (billform) => billform.idBillForm === selectedRowKeys[0],
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
            idRef: billform.idBillForm!,
            name: billform.displayName!,
          },
        }),
      );
    }
    if (fgImportModel) {
      if (billform.metaData) {
        const metaData = JSON.parse(billform.metaData);
        const moduleTypes = getModuleTypes(metaData, true);
        const mainType = moduleTypes.find((m) => m.fgMain);
        const refTypes = moduleTypes.filter((m) => !m.fgMain);
        if (mainType) {
          dispatch(actions.updateModelTyps({ mainType, refTypes }));
        }
      } else {
        message.error('所选表单模板元数据为空！');
      }
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

  const columns: TableColumnType<TBillForm>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: '200px',
      render: (value: any, record: TBillForm, index: number) => {
        return <span>{record.name}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      width: '200px',
      render: (value: any, record: TBillForm, index: number) => {
        return <span>{record.displayName}</span>;
      },
    },
  ];

  const onRow = (record: TBillForm) => {
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record.idBillForm!]);
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleSelect = (
    record: TBillForm,
    select: boolean,
    selectedRows: TBillForm[],
  ) => {
    setSelectedRowKeys([record.idBillForm!]);
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setFgImportModel(e.target.checked);
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
                    <Checkbox onChange={handleCheckboxChange}>
                      导入模型数据
                    </Checkbox>
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
                    rowKey={'idBillForm'}
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

export default BillformComp;
