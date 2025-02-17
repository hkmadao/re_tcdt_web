import { Button, Modal, Table } from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { TDescriptionInfo } from '../../../../../model';
import { ColumnsType } from 'antd/lib/table';
import { TTree } from '@/models';

const columns: ColumnsType<TDescriptionInfo> = [
  {
    title: '属性名称',
    dataIndex: 'fullAttributeName',
    key: 'fullAttributeName',
  },
  {
    title: '显示名称',
    dataIndex: 'displayName',
    key: 'displayName',
  },
];

/**根据keys获取树节点数据 */
export const getSelectedNodes = (
  selectedKeys: Key[],
  tree: TTree[],
): TTree[] => {
  const selectedNodes: TTree[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (selectedKeys.includes(node.id!)) {
      selectedNodes.push({ ...node });
    }
    const childResult = getSelectedNodes(selectedKeys, node.children ?? []);
    selectedNodes.push(...childResult);
  }
  return selectedNodes;
};

const SelectAttribute: FC<{
  idComponentEntity?: string;
  metadata?: TDescriptionInfo;
  callback: (treeDatas: TDescriptionInfo[]) => void;
}> = ({ idComponentEntity, metadata, callback }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TDescriptionInfo[]>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (metadata) {
      const tableData =
        metadata.children?.map((m) => {
          return { ...m };
        }) || [];
      setTableData(tableData);
    }
  }, [metadata]);

  /**点击 */
  const handleOpen = () => {
    setSelectedRowKeys([]);
    setModalVisible(true);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认选中组件实体 */
  const handleOk = () => {
    // const selectRows: TMetaData[] = tableData?.filter(td => selectedRowKeys.includes(td.id!)) || [];
    const selectRows: TDescriptionInfo[] = getSelectedNodes(
      selectedRowKeys,
      tableData ?? [],
    );
    callback(selectRows);
    setModalVisible(false);
  };

  const handleSelect = (record: TDescriptionInfo, selected: boolean) => {
    if (record.children && record.children.length > 0) {
      return;
    }
    if (selectedRowKeys.includes(record.id!)) {
      setSelectedRowKeys(selectedRowKeys.filter((k) => k !== record.id));
      return;
    }
    setSelectedRowKeys([...selectedRowKeys, record.id!]);
  };

  return (
    <>
      <div>
        <Button size="small" type="primary" onClick={handleOpen}>
          选择添加
        </Button>
      </div>
      <Modal
        title="选择属性"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOk}
        width={'800px'}
      >
        <Table
          rowKey={'id'}
          size={'small'}
          dataSource={tableData}
          columns={columns}
          scroll={{ y: 500 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onSelect: handleSelect,
          }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                if (record.children && record.children.length > 0) {
                  return;
                }
                if (selectedRowKeys.includes(record.id!)) {
                  setSelectedRowKeys(
                    selectedRowKeys.filter((k) => k !== record.id),
                  );
                  return;
                }
                setSelectedRowKeys([...selectedRowKeys, record.id!]);
              }, // 点击行
              onDoubleClick: (event) => {},
              onContextMenu: (event) => {},
              onMouseEnter: (event) => {}, // 鼠标移入行
              onMouseLeave: (event) => {},
            };
          }}
          expandable={{
            expandRowByClick: true,
            expandIcon: (node: any) => {
              if (node.record.children && node.record.children.length > 0) {
                if (node.expanded) {
                  return <span style={{ marginRight: '5px' }}>-</span>;
                } else {
                  return <span style={{ marginRight: '5px' }}>+</span>;
                }
              }
              return <></>;
            },
          }}
        />
      </Modal>
    </>
  );
};

export default SelectAttribute;
