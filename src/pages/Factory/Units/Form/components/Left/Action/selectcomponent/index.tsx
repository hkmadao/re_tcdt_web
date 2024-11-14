import {
  andLogicNode,
  equalFilterNode,
  i32FilterParam,
  likeFullFilterNode,
  orLogicNode,
  stringFilterParam,
  TPageInfo,
  TPageInfoInput,
} from '@/models';
import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  TableColumnType,
  Tooltip,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TBillForm } from '@/pages/Factory/Units/Form/model';
import API from '@/pages/Factory/Units/Form/api';
import BillfromTable from './BillfromTable';
import {
  fetchById,
  getComponentAttributeTreeById,
} from '@/pages/Factory/Units/Form/store/async-thunk';
import { SettingOutlined } from '@ant-design/icons';
import ComponentTree from '@/pages/Factory/common/ComponentTree';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';

const SelectComponent: FC = () => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [tableSpinning, setTableSpinning] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [billformTableData, setBillformTableData] = useState<TBillForm[]>([]);
  const [compUpTreeInfo, setCompUpTreeInfo] = useState<TCompUpTreeInfo>();
  const [searchValue, setSearchValue] = useState<string>();
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleComponentSelect = (nodeData?: TCompUpTreeInfo) => {
    if (nodeData) {
      setCompUpTreeInfo({
        ...nodeData,
      });
      setSelectedRowKeys([]);
      fetchBillForm(nodeData, undefined);
    } else {
      setCompUpTreeInfo(undefined);
      setSelectedRowKeys([]);
    }
  };

  /**获取表单模板 */
  const fetchBillForm = async (
    nodeData: TCompUpTreeInfo | undefined,
    search: string | undefined,
    page?: number,
    pageSize?: number,
  ) => {
    setSearchValue(search);
    let param: TPageInfoInput = {};
    if (nodeData) {
      if (nodeData.idComponent) {
        param = {
          pageIndex: page ? page : 1,
          pageSize: pageSize ? pageSize : 10,
          logicNode: andLogicNode([
            equalFilterNode(
              'idComponent',
              stringFilterParam(nodeData.idComponent),
            ),
          ])(),
        };
      } else if (nodeData.idComponentModule) {
        param = {
          pageIndex: page ? page : 1,
          pageSize: pageSize ? pageSize : 10,
          logicNode: andLogicNode([
            equalFilterNode(
              'idComponentModule',
              stringFilterParam(nodeData.idComponentModule),
            ),
          ])(),
        };
      } else if (nodeData.idSubProject) {
        param = {
          pageIndex: page ? page : 1,
          pageSize: pageSize ? pageSize : 10,
          logicNode: andLogicNode([
            equalFilterNode(
              'idSubProject',
              stringFilterParam(nodeData.idSubProject),
            ),
          ])(),
        };
      } else if (nodeData.idProject) {
        param = {
          pageIndex: page ? page : 1,
          pageSize: pageSize ? pageSize : 10,
          logicNode: andLogicNode([
            equalFilterNode('idProject', stringFilterParam(nodeData.idProject)),
          ])(),
        };
      }
    } else {
      //搜索框的有值，不传树节点条件
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
      setCompUpTreeInfo(undefined);
    }
    if (param.logicNode) {
      setTableSpinning(true);
      const pageData = await API.getBillForm(param);
      setTableSpinning(false);
      setPageIndex(pageData.pageInfoInput.pageIndex || 1);
      setPageSize(pageData.pageInfoInput.pageSize || 10);
      setTotal(pageData.pageInfoInput.totalCount || 0);
      if (pageData.dataList) {
        setBillformTableData(pageData.dataList);
      } else {
        setBillformTableData([]);
      }
    }
  };

  /**点击选择组件 */
  const handleToSelectComponent = () => {
    setCompUpTreeInfo(undefined);
    setBillformTableData([]);
    setSelectedRowKeys([]);
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
    // dispatch(getComponentAttributeTreeById(billform.idComponent!));
    dispatch(
      fetchById({
        id: billform.idBillForm!,
        idComponent: billform.idComponent!,
      }),
    );
    setModalVisible(false);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const onPageChange = (page: number, pageSize: number) => {
    fetchBillForm(compUpTreeInfo, searchValue, page, pageSize);
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
    {
      dataIndex: 'projectName',
      title: '所属项目',
      width: '200px',
      render: (value: any, record: TBillForm, index: number) => {
        return <span>{record.projectName}</span>;
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

  return (
    <>
      <span>
        <Tooltip title={'选则组件'}>
          <Button
            type={'text'}
            onClick={handleToSelectComponent}
            size={'middle'}
            icon={<SettingOutlined />}
          ></Button>
        </Tooltip>
      </span>
      <Modal
        title="选择组件"
        maskClosable={false}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleConfBillform}
        width={'1000px'}
        destroyOnClose={true}
      >
        <Spin spinning={spinning}>
          <div style={{ height: '500px', overflow: 'auto' }}>
            <Row>
              <Col span={8} style={{}}>
                <div style={{ height: '500px', overflow: 'auto' }}>
                  <ComponentTree
                    fgLoadData={modalVisible}
                    setSpinning={setSpinning}
                    handleSelect={handleComponentSelect}
                  />
                </div>
              </Col>
              <Col span={16}>
                <Spin spinning={tableSpinning}>
                  <BillfromTable
                    compUpTreeInfo={compUpTreeInfo}
                    selectedRowKeys={selectedRowKeys}
                    handleConfBillform={handleConfBillform}
                    searchCallBack={fetchBillForm}
                  />
                  <div style={{ height: '450px', overflow: 'auto' }}>
                    <Space direction={'vertical'} size={5}>
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
                </Spin>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default SelectComponent;
