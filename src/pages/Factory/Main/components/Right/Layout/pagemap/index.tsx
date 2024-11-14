import { Button, Input, message, Modal, Space } from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '../../../Main.less';
import { actions, selectCurrentLayout } from '../../../../store';
import {
  ActionType,
  EditableProTable,
  nanoid,
  ProColumns,
} from '@ant-design/pro-components';
import { TPageMap } from '@/pages/Factory/Main/model';
import { useColumns } from './hooks';

const PageMap: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableRowKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const currentLayout = useSelector(selectCurrentLayout);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const columns: ProColumns<TPageMap>[] = useColumns();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  /**点击配置表单 */
  const handleOK = () => {
    setModalVisible(false);
  };

  /**点击打开弹窗 */
  const handleOpen = () => {
    setModalVisible(true);
  };

  /**点击关闭弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleClear = () => {
    if (currentLayout) {
      dispatch(
        actions.updateLayout({
          ...currentLayout,
          pageMaps: [],
        }),
      );
    }
  };

  /**编辑行内容改变处理 */
  const handleFormChange: (record: TPageMap, dataSource: TPageMap[]) => void = (
    record,
    dataSource,
  ) => {
    if (currentLayout) {
      dispatch(
        actions.updateLayout({
          ...currentLayout,
          pageMaps: dataSource,
        }),
      );
    }
  };

  /**行操作 */
  const handleRow = (record: TPageMap) => {
    return {
      onClick: async (_event: any) => {
        editableRowKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idPageMap!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAddRow = () => {
    const pageMap: TPageMap = {
      idPageMap: nanoid(),
      componentStateCode: 'default',
      pageCode: '',
    };
    if (currentLayout) {
      const pageMaps = currentLayout.pageMaps?.slice(0) || [];
      pageMaps.push(pageMap);
      dispatch(
        actions.updateLayout({
          ...currentLayout,
          pageMaps,
        }),
      );
      editableRowKeys.forEach((editableKey) =>
        actionRef.current?.cancelEditable(editableKey),
      );
      actionRef.current?.startEditable(pageMap.idPageMap as React.Key);
    }
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableRowKeys && editableRowKeys.length === 1) {
      if (currentLayout) {
        const pageMaps = currentLayout.pageMaps?.filter(
          (p) => p.idPageMap !== editableRowKeys[0],
        );
        dispatch(
          actions.updateLayout({
            ...currentLayout,
            pageMaps,
          }),
        );
      }
    }
  };

  return (
    <>
      <span>
        <Input
          value={
            currentLayout?.pageMaps && currentLayout?.pageMaps.length > 0
              ? JSON.stringify(currentLayout?.pageMaps)
              : undefined
          }
          readOnly
          placeholder={'请配置'}
          suffix={
            <Space direction="horizontal" size={2}>
              {currentLayout?.pageMaps && currentLayout?.pageMaps.length > 0 ? (
                <CloseOutlined onClick={handleClear} />
              ) : (
                ''
              )}
              <Button size="small" type="primary" onClick={handleOpen}>
                <SearchOutlined />
              </Button>
            </Space>
          }
        />
      </span>
      <Modal
        title="页面映射"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOK}
        width={'800px'}
      >
        <div style={{ height: '450px', overflow: 'auto' }}>
          <Space direction={'vertical'} size={'small'}>
            <Space direction={'horizontal'} size={'small'}>
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
                disabled={!editableRowKeys || editableRowKeys.length == 0}
              >
                删除
              </Button>
            </Space>
            <EditableProTable<TPageMap>
              className={styles['my-ant-card-body']}
              actionRef={actionRef}
              rowKey={'idPageMap'}
              headerTitle={false}
              bordered={true}
              size={'small'}
              maxLength={5}
              recordCreatorProps={false}
              value={currentLayout?.pageMaps}
              columns={columns}
              editable={{
                type: 'multiple',
                editableKeys: editableRowKeys,
                onChange: setEditableRowKeys,
                onValuesChange: handleFormChange,
              }}
              onRow={handleRow}
            />
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default PageMap;
