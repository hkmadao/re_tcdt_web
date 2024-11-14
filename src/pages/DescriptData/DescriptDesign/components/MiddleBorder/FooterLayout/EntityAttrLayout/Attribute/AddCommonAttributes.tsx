import { FC, Key, useState } from 'react';
import { Table, TableColumnType, Modal, Button, Checkbox, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { TCommonAttribute } from '@/pages/DescriptData/DescriptDesign/models';
import {
  actions,
  selectCurrentDiagramContent,
  selectSysCommonAttributes,
  selectSysDataTypes,
} from '@/pages/DescriptData/DescriptDesign/store';

const AddCommonAttributes: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const dataTypes = useSelector(selectSysDataTypes);
  const commonAttributes = useSelector(selectSysCommonAttributes);
  const idEntity = useSelector(selectCurrentDiagramContent);
  const [searchValue, setSearchValue] = useState<string>();
  const [brief, setBrief] = useState<boolean>(true);
  const dispatch = useDispatch();

  const { dataSource } = ((entities, searchValue) => {
    const newDataSource = entities.filter((attr) => {
      if (!searchValue) {
        return true;
      }
      if (
        attr.attributeName?.includes(searchValue) ||
        attr.columnName?.includes(searchValue) ||
        attr.displayName?.includes(searchValue)
      ) {
        return true;
      }
      return false;
    });
    return { dataSource: newDataSource };
  })(commonAttributes, searchValue);

  const handleChange = (e: any) => {
    setSearchValue(e.currentTarget.value);
  };

  /**切换显示字段 */
  const handleToggleColumns = () => {
    setBrief(!brief);
  };

  /**添加公共字段 */
  const handleAddCommon = () => {
    setSelectedRowKeys([]);
    setIsModalVisible(true);
  };

  /**添加公共字段 */
  const handleOk = () => {
    if (selectedRowKeys.length === 0) {
      return;
    }
    const selectedRows =
      dataSource.filter((t) =>
        selectedRowKeys.includes(t.idCommonAttribute!),
      ) || [];
    dispatch(
      actions.addAttributesByCommAttr({
        idEntity: idEntity!,
        commonAttrs: selectedRows,
      }),
    );
    setIsModalVisible(false);
  };
  /**添加公共字段 */
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectRowChange = (
    selectedRowKeys: Key[],
    selectedRows: any[],
  ) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onRow = (record: TCommonAttribute) => {
    return {
      onClick: (event: any) => {
        let newKeys = selectedRowKeys?.slice();
        if (!newKeys.includes(record.idCommonAttribute!)) {
          newKeys?.push(record.idCommonAttribute!);
          setSelectedRowKeys(newKeys);
        } else {
          newKeys = newKeys?.filter(
            (idKey) => idKey !== record.idCommonAttribute,
          );
          setSelectedRowKeys(newKeys);
        }
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  const baseColumns: TableColumnType<TCommonAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      key: 'sn',
      width: 50,
      fixed: 'left',
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.sn ? record.sn : '--'}</>;
      },
    },
    {
      title: '字段名称',
      dataIndex: 'columnName',
      key: 'columnName',
      width: 150,
      fixed: 'left',
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.columnName ? record.columnName : '--'}</>;
      },
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.displayName ? record.displayName : '--'}</>;
      },
    },
    {
      title: '属性名称',
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.attributeName ? record.attributeName : '--'}</>;
      },
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.defaultValue ? record.defaultValue : '--'}</>;
      },
    },
    {
      title: '必填',
      dataIndex: 'fgMandatory',
      key: 'fgMandatory',
      width: 50,
      render: (_dom: any, record: TCommonAttribute) => {
        return (
          <>
            {' '}
            <Checkbox checked={record.fgMandatory ?? false} />{' '}
          </>
        );
      },
    },
  ];

  const moreColumns: TableColumnType<TCommonAttribute>[] = [
    {
      title: '数据长度',
      dataIndex: 'len',
      key: 'len',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.len ? record.len : '--'}</>;
      },
    },
    {
      title: '精度',
      dataIndex: 'pcs',
      key: 'pcs',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.pcs ? record.pcs : '--'}</>;
      },
    },
    {
      title: '引用属性名称',
      dataIndex: 'refAttributeName',
      key: 'refAttributeName',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.refAttributeName ? record.refAttributeName : '--'}</>;
      },
    },
    {
      title: '引用属性显示名称',
      dataIndex: 'refDisplayName',
      key: 'refDisplayName',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.refDisplayName ? record.refDisplayName : '--'}</>;
      },
    },
    {
      title: '属性类别',
      dataIndex: 'category',
      key: 'category',
      render: (_dom: any, record: TCommonAttribute) => {
        return <>{record.category ? record.category : '--'}</>;
      },
      width: 150,
    },
    {
      title: '数据类型',
      dataIndex: 'idDataType',
      key: 'idDataType',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        const attributeType = dataTypes.find((dataType) => {
          return record.idDataType === dataType.idDataType;
        });
        return <>{attributeType?.displayName}</>;
      },
    },
    {
      title: '实体信息',
      dataIndex: 'idRefEntity',
      key: 'idRefEntity',
      width: 150,
      render: (_dom: any, record: TCommonAttribute) => {
        return record.refEntity?.displayName;
      },
    },
  ];

  return (
    <>
      <Button size={'small'} onClick={handleAddCommon} icon={<PlusOutlined />}>
        选择添加
      </Button>
      <Modal
        title={'属性类型'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'1000px'}
      >
        <div
          style={{
            marginBottom: '5px',
          }}
        >
          <span>
            总共
            <span
              style={{ color: 'blue', margin: '0px 5px', fontSize: '18px' }}
            >
              {commonAttributes?.length ?? 0}
            </span>
            条目，
          </span>
          <span>
            筛选出
            <span
              style={{ color: 'blue', margin: '0px 5px', fontSize: '18px' }}
            >
              {dataSource.length ?? 0}
            </span>
            条目，
          </span>
          <span>
            已选择
            <span
              style={{ color: 'blue', margin: '0px 5px', fontSize: '18px' }}
            >
              {selectedRowKeys.length}
            </span>
            条目
          </span>
          <Input
            size={'small'}
            style={{ width: '200px', marginLeft: '10px' }}
            placeholder="请输入过虑条件"
            onChange={handleChange}
          />
          <Button
            size={'small'}
            type={'primary'}
            style={{ margin: '0px 5px' }}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setSelectedRowKeys([])}
          >
            清空
          </Button>
          <Button size={'small'} onClick={handleToggleColumns}>
            {brief ? '更多' : '简略'}
          </Button>
        </div>
        <Table
          size={'small'}
          rowKey={'idCommonAttribute'}
          onRow={onRow}
          columns={brief ? [...baseColumns] : [...baseColumns, ...moreColumns]}
          dataSource={dataSource}
          scroll={{ x: 1000, y: 400 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: handleSelectRowChange,
          }}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default AddCommonAttributes;
