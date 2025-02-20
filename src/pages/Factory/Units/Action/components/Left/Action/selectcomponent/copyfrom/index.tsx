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
  Form,
  Input,
  InputRef,
  message,
  Modal,
  Row,
  Space,
  Table,
  TableColumnType,
} from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { TCompUpTreeInfo } from '@/pages/Factory/common/model';
import ModuleAPI from '@/pages/Factory/Units/Action/api';
import { TAction, TActionContent } from '@/pages/Factory/Units/Action/model';
import ComponentTree from '@/pages/Factory/common/ComponentTree';
import ComponentRef from '@/pages/Factory/common/ref/componenttree';
import { nanoid } from '@reduxjs/toolkit';

const CopyForm: FC<{
  compUpTreeInfo?: TCompUpTreeInfo;
  saveCallback: () => void;
}> = ({ compUpTreeInfo, saveCallback }) => {
  const [form] = Form.useForm<TAction>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
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
    setSelectIdSubProject(idSubProject);
    setSelectIdComponentModule(idComponentModule);
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

  const myCompUpTreeInfo = useMemo(() => compUpTreeInfo, [compUpTreeInfo]);

  const fgDisabled = useMemo(() => {
    return !compUpTreeInfo?.idComponent;
  }, [compUpTreeInfo]);

  const handleToCopy = () => {
    setSelectIdSubProject(undefined);
    setTableData([]);
    setSelectedRowKeys([]);
    setModalVisible(true);
  };

  const handleCopy = async () => {
    if (!selectedRowKeys || selectedRowKeys.length !== 1) {
      message.error('请选择一条记录');
      return;
    }
    const copyId = selectedRowKeys[0];
    const copyRecord = tableData.find(
      (record) => record.idButtonAction === copyId,
    );
    if (!copyRecord) {
      message.error('请选择一条记录');
      return;
    }
    const recordDetail: TAction = await ModuleAPI.getById(
      copyRecord.idButtonAction,
    );
    const newAction: TAction = {
      ...recordDetail,
      ...compUpTreeInfo,
      idButtonAction: nanoid(),
      name: recordDetail.name + '_copy',
      displayName: recordDetail.displayName + '_copy',
    };

    form.setFieldsValue(newAction);
    setAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  const handleSave = async () => {
    const billForm = await form.validateFields();
    const toSaveData: TAction = {
      ...billForm,
    };
    if (toSaveData.content) {
      let contentObj: TActionContent = {
        ...JSON.parse(toSaveData.content),
        ...myCompUpTreeInfo,
        name: toSaveData.name,
        displayName: toSaveData.displayName,
      };
      toSaveData.content = JSON.stringify(contentObj);
    }
    const saveBillForm = await ModuleAPI.addAction({
      ...myCompUpTreeInfo,
      ...toSaveData,
    });

    saveCallback();
    setAddModalVisible(false);
    setModalVisible(false);
  };

  return (
    <>
      <Button
        type={'primary'}
        size={'small'}
        onClick={handleToCopy}
        disabled={fgDisabled}
      >
        从...复制
      </Button>
      <Modal
        title="复制..."
        maskClosable={false}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={''}
        width={'800px'}
        destroyOnClose={true}
      >
        <div style={{ height: '500px', overflow: 'auto' }}>
          <Row>
            <Col span={8} style={{}}>
              <div style={{ height: '500px', overflow: 'auto' }}>
                <ComponentTree
                  fgLoadData={modalVisible}
                  idSubProject={undefined}
                  idTreeSelected={undefined}
                  idSelected={undefined}
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
                      onClick={handleSearch}
                      disabled={!!selectedIdSubProject}
                      type={'primary'}
                    >
                      <SearchOutlined />
                    </Button>
                    <Button
                      size={'small'}
                      onClick={handleCopy}
                      disabled={
                        !selectedRowKeys || selectedRowKeys.length === 0
                      }
                      type={'primary'}
                    >
                      复制
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
      <Modal
        title="添加..."
        open={addModalVisible}
        onOk={handleSave}
        onCancel={handleAddCancel}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="billform"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item label="组件id" name="idComponent">
            <ComponentRef
              {...myCompUpTreeInfo}
              okCallback={() => {
                return;
              }}
              disabled
            />
          </Form.Item>
          <Form.Item label="idButtonAction" name="idButtonAction" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="content" name="content" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: 'Please input displayName!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CopyForm;
