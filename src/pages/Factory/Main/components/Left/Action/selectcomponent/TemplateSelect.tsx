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
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Table,
  TableColumnType,
  message,
} from 'antd';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import ModuleAPI from '@/pages/Factory/Main/api';
import { TUiFactory } from '@/pages/Factory/Main/model';

const TemplateSelect: FC<{
  disabled: boolean;
  onSelected: (template: TUiFactory) => void;
}> = ({ disabled, onSelected }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<TUiFactory[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const searchRef = useRef<InputRef>(null);
  const [myDisabled, setMyDisabled] = useState<boolean>(false);

  useEffect(() => {
    setMyDisabled(disabled);
  }, [disabled]);

  const handleToSelect = () => {
    fetchUiFactory('', 1, 10);
    setModalVisible(true);
  };

  const handleOk = () => {
    if (selectedRowKeys.length !== 1) {
      message.error('请选择模板！');
      return;
    }
    const template = tableData.find((t) =>
      selectedRowKeys.includes(t.idFactory!),
    );
    if (!template) {
      message.error('请选择模板！');
      return;
    }
    onSelected(template);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSearch = () => {
    fetchUiFactory(searchValue, 1, 10);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchValue(e.target.value);
  };

  const onRow = (record: TUiFactory) => {
    return {
      onClick: (event: any) => {
        setSelectedRowKeys([record.idFactory!]);
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const handleSelect = (
    record: TUiFactory,
    select: boolean,
    selectedRows: TUiFactory[],
  ) => {
    setSelectedRowKeys([record.idFactory!]);
  };

  const onPageChange = (page: number, pageSize: number) => {
    fetchUiFactory(searchValue, page, pageSize);
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const handleDeleteOk = async () => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const id = selectedRowKeys[0];
      const data: TUiFactory = await ModuleAPI.getById(id as string);
      await ModuleAPI.deleteUiFactory(data);
      message.info('删除成功！');
      setTableData(
        tableData.filter((t) => !selectedRowKeys.includes(t.idFactory!)),
      );
      setSelectedRowKeys([]);
    }
  };

  const columns: TableColumnType<TUiFactory>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: '200px',
      render: (value: any, record: TUiFactory, index: number) => {
        return <span>{record.name}</span>;
      },
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
      width: '200px',
      render: (value: any, record: TUiFactory, index: number) => {
        return <span>{record.displayName}</span>;
      },
    },
  ];

  /**获取查询模板模板 */
  const fetchUiFactory = (
    search: string | undefined,
    page?: number,
    pageSize?: number,
  ) => {
    setSearchValue(search);
    let param: TPageInfoInput = {
      pageIndex: page ? page : 1,
      pageSize: pageSize ? pageSize : 10,
      logicNode: andLogicNode([
        equalFilterNode('fgTemplate', i32FilterParam(1)),
      ])(
        orLogicNode([
          likeFullFilterNode('name', stringFilterParam(search ?? '')),
          likeFullFilterNode('displayName', stringFilterParam(search ?? '')),
        ])(),
      ),
    };
    //搜索框有值，需要置空左树节点数据
    setSelectedRowKeys([]);
    if (param.logicNode) {
      ModuleAPI.getUiFactory(param).then((pageData: TPageInfo<TUiFactory>) => {
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

  return (
    <>
      <Button
        type={'primary'}
        size={'small'}
        onClick={handleToSelect}
        disabled={myDisabled}
      >
        选择模板
      </Button>
      <Modal
        title="选则模板"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          style={{
            height: '450px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Popconfirm
              placement="top"
              title={'确定删除提示'}
              onConfirm={handleDeleteOk}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type={'primary'}
                size={'small'}
                disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
              >
                删除
              </Button>
            </Popconfirm>
            <Input
              size={'small'}
              ref={searchRef}
              onChange={handleSearchInputChange}
              style={{ width: '150px' }}
            />
            <Button size={'small'} onClick={handleSearch} type={'primary'}>
              <SearchOutlined />
            </Button>
          </div>
          <Table
            rowKey={'idFactory'}
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
        </div>
      </Modal>
    </>
  );
};

export default TemplateSelect;
