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
import { SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Space,
  Table,
  TableColumnType,
  Tooltip,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TTreeConf } from '../../../../model';
import API from '../../../../api';
import BillfromTable from './BillfromTable';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';
import ComponentTree from '@/pages/Factory/common/ComponentTree';
import {
  fetchById,
  getComponentAttributeTreeById,
} from '../../../../store/async-thunk';

const SelectComponent: FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TTreeConf[]>([]);
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
      fetchUiFactory(nodeData, undefined);
    } else {
      setCompUpTreeInfo(undefined);
      setSelectedRowKeys([]);
    }
  };

  /**获取查询模板模板 */
  const fetchUiFactory = (
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
      API.get(param).then((pageData: TPageInfo<TTreeConf>) => {
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

  /**点击选择组件 */
  const handleToSelectComponent = () => {
    setCompUpTreeInfo(undefined);
    setTableData([]);
    setSelectedRowKeys([]);
    setModalVisible(true);
  };

  /**点击配置查询模板 */
  const handleConfBillform = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warn('请先选择查询模板模板！');
      return;
    }
    const billform = tableData.find(
      (billform) => billform.idTree === selectedRowKeys[0],
    );
    if (!billform) {
      message.warn('找不到对应查询模板模板！');
      return;
    }
    dispatch(getComponentAttributeTreeById(billform.idComponent!));
    dispatch(fetchById(billform.idTree!));
    setModalVisible(false);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const onPageChange = (page: number, pageSize: number) => {
    fetchUiFactory(compUpTreeInfo, searchValue, page, pageSize);
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const columns: TableColumnType<TTreeConf>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: '200px',
      render: (value: any, record: TTreeConf, index: number) => {
        return <span>{record.name}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      width: '200px',
      render: (value: any, record: TTreeConf, index: number) => {
        return <span>{record.displayName}</span>;
      },
    },
    {
      dataIndex: 'projectName',
      title: '所属项目',
      width: '200px',
      render: (value: any, record: TTreeConf, index: number) => {
        return <span>{record.projectName}</span>;
      },
    },
  ];

  const onRow = (record: TTreeConf) => {
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record.idTree!]);
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleSelect = (
    record: TTreeConf,
    select: boolean,
    selectedRows: TTreeConf[],
  ) => {
    setSelectedRowKeys([record.idTree!]);
  };

  return (
    <>
      <span>
        <Tooltip title={'选则子项目'}>
          <Button
            type={'text'}
            onClick={handleToSelectComponent}
            size={'middle'}
            icon={<SettingOutlined />}
          ></Button>
        </Tooltip>
      </span>
      <Modal
        title="选择子项目"
        maskClosable={false}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleConfBillform}
        width={'1000px'}
        destroyOnClose={true}
      >
        <div style={{ height: '500px', overflow: 'auto' }}>
          <Row>
            <Col span={8} style={{}}>
              <div style={{ height: '500px', overflow: 'auto' }}>
                <ComponentTree
                  fgLoadData={modalVisible}
                  handleSelect={handleComponentSelect}
                />
              </div>
            </Col>
            <Col span={16}>
              <BillfromTable
                compUpTreeInfo={compUpTreeInfo}
                selectedRowKeys={selectedRowKeys}
                handleConfBillform={handleConfBillform}
                searchCallBack={fetchUiFactory}
              />
              <div style={{ height: '450px', overflow: 'auto' }}>
                <Space direction={'vertical'} size={5}>
                  <Table
                    rowKey={'idTree'}
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

export default SelectComponent;
