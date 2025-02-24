import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AutoComplete, Button, Input, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';
import styles from '@/pages/Factory/Units/common/less/styles.less';
import { TOrderInfo } from '../../../Form/model/billform-common';

const OrderConf: FC<{
  inputOptions: { value: string }[];
  sourceOrderInfoList: TOrderInfo[];
  callback: (orderInfoList: TOrderInfo[]) => void;
}> = ({ inputOptions, sourceOrderInfoList, callback }) => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>();
  const [orderInfoList, setOrderInfoList] = useState<TOrderInfo[]>([]);
  const [displayValue, setDisplayValue] = useState<string>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (sourceOrderInfoList) {
      setDisplayValue(JSON.stringify(sourceOrderInfoList));
      setOrderInfoList(sourceOrderInfoList);
    } else {
      setDisplayValue(undefined);
      setOrderInfoList([]);
    }
  }, [sourceOrderInfoList]);

  const selectOptions = useMemo(() => inputOptions, [inputOptions]);

  const orderInfoColumns: ProColumns<TOrderInfo>[] = [
    {
      editable: false,
      title: 'ID',
      dataIndex: 'idOrderInfo',
      key: 'idOrderInfo',
    },
    {
      title: '排序属性',
      dataIndex: 'orderProperty',
      key: 'orderProperty',
      render: (text, record, _, action) => {
        return text;
      },
      renderFormItem: () => {
        return (
          <AutoComplete
            options={selectOptions}
            style={{ width: 200 }}
            placeholder="input here"
          />
        );
      },
    },
    {
      title: '排序类型',
      dataIndex: 'orderType',
      key: 'orderType',
      valueType: 'select',
      valueEnum: {
        ASC: {
          text: '升序',
          status: 'ASC',
        },
        DESC: {
          text: '降序',
          status: 'DESC',
        },
      },
    },
  ];

  const openRefConfigModal = () => {
    setModalVisible(true);
  };

  const handleConfigOk = async () => {
    if (orderInfoList) {
      setDisplayValue(JSON.stringify(orderInfoList));
      callback(orderInfoList);
      setModalVisible(false);
    }
  };

  const handleConfigCancel = () => {
    setModalVisible(false);
  };

  /**添加行 */
  const handleAddRow = () => {
    const newOrderInfo: TOrderInfo = {
      idOrderInfo: nanoid(),
      orderProperty: 'orderProperty',
      orderType: 'ASC',
    };
    const newDataList = orderInfoList?.slice(0);
    newDataList?.push(newOrderInfo);
    setOrderInfoList(newDataList);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newOrderInfo.idOrderInfo as React.Key);
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TOrderInfo,
    dataSource: TOrderInfo[],
  ) => void = (record, dataSource) => {
    setOrderInfoList(dataSource);
  };
  /**行操作 */
  const handleRow = (record: TOrderInfo) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idOrderInfo);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const id = editableKeys[0];
      const newDataList = orderInfoList?.filter(
        (attr) => attr.idOrderInfo !== id,
      );
      setOrderInfoList(newDataList);
    }
  };

  return (
    <>
      <Input.Search
        size={'small'}
        value={displayValue}
        onSearch={openRefConfigModal}
        enterButton
      />
      <Modal
        title="排序配置"
        open={modalVisible}
        onOk={handleConfigOk}
        onCancel={handleConfigCancel}
        destroyOnClose={true}
        width={800}
      >
        <Space size={10} direction={'vertical'}>
          <Space size={2}>
            <Button
              size={'small'}
              onClick={handleAddRow}
              icon={<PlusOutlined />}
            >
              添加
            </Button>
            <Button
              size={'small'}
              onClick={handleDelete}
              disabled={!editableKeys || editableKeys.length == 0}
            >
              删除
            </Button>
          </Space>
          <EditableProTable<TOrderInfo>
            className={classNames(styles['my-ant-card-body'])}
            actionRef={actionRef}
            rowKey={'idOrderInfo'}
            headerTitle={false}
            bordered={true}
            size={'small'}
            scroll={{ x: '300px', y: '150px' }}
            maxLength={5}
            recordCreatorProps={false}
            value={orderInfoList}
            columns={orderInfoColumns}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              onValuesChange: handleFormChange,
            }}
            onRow={handleRow}
          />
        </Space>
      </Modal>
    </>
  );
};
export default OrderConf;
