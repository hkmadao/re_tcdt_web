import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Space, Button } from 'antd';
import { FC, useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { actions, selectCurrentConf } from './store';
import styles from './index.less';
import { GenerateType, TSubPath } from './models';
import SelectPath from './SelectPath';

const SubItem: FC<{ attrName: GenerateType; fgEdit: boolean }> = ({
  attrName,
  fgEdit,
}) => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm<TSubPath>();
  const dispatch = useDispatch();
  const currentConf = useSelector(selectCurrentConf);
  const [tableDatas, setTableDatas] = useState<TSubPath[]>([]);
  const [myFgEdit, setMyFgEdit] = useState<boolean>(fgEdit);

  useEffect(() => {
    setMyFgEdit(fgEdit);
  }, [fgEdit]);

  useEffect(() => {
    if (currentConf && currentConf[attrName]) {
      const paths = currentConf[attrName] as TSubPath[];
      setTableDatas(paths);
    }
  }, [currentConf]);

  /**编辑行内容改变处理 */
  const handleFormChange: (record: TSubPath, dataSource: TSubPath[]) => void = (
    record,
    dataSource,
  ) => {
    if (editableKeys) {
      editableKeys.forEach((eKey) => {
        const newRecord = { ...record };
        dispatch(actions.updateSubItem({ attrName, data: newRecord }));
      });
    }
  };

  /**行操作 */
  const handleRow = (record: TSubPath) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.id!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAddRow = () => {
    const newRecord: TSubPath = {
      id: nanoid(),
      sourceDir: '',
      targetDir: '',
    };
    dispatch(actions.addSubItem({ attrName, data: newRecord }));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newRecord.id as React.Key);
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const newRecord = tableDatas?.find((mp) => editableKeys[0] === mp.id);
      if (newRecord) {
        dispatch(actions.deleteSubItem({ attrName, data: newRecord }));
      }
    }
  };

  const columns: ProColumns<TSubPath>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (text, record, _, action) => {
        return <>{record.id ? record.id : '--'}</>;
      },
    },
    {
      title: '源地址',
      dataIndex: 'sourceDir',
      key: 'sourceDir',
      render: (text, record, _, action) => {
        return <>{record.sourceDir ? record.sourceDir : '--'}</>;
      },
    },
    {
      title: '目的地址',
      dataIndex: 'targetDir',
      key: 'targetDir',
      render: (text, record, _, action) => {
        return <>{record.targetDir ? record.targetDir : '--'}</>;
      },
      renderFormItem: () => {
        return <SelectPath />;
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Space size={2}>
          <Button
            size={'small'}
            onClick={handleAddRow}
            icon={<PlusOutlined />}
            disabled={!myFgEdit}
          >
            添加
          </Button>
          <Button
            size={'small'}
            onClick={handleDelete}
            disabled={!myFgEdit || !editableKeys || editableKeys.length == 0}
          >
            删除
          </Button>
        </Space>
        <div
          style={{
            display: tableDatas.length === 0 ? 'block' : 'block',
          }}
        >
          <EditableProTable<TSubPath>
            className={styles['my-ant-card-body']}
            style={{ padding: '0px' }}
            actionRef={actionRef}
            rowKey={'id'}
            headerTitle={false}
            bordered={true}
            size={'small'}
            maxLength={5}
            recordCreatorProps={false}
            value={tableDatas}
            columns={columns}
            editable={{
              type: 'multiple',
              form,
              editableKeys: myFgEdit ? editableKeys : [],
              onChange: setEditableRowKeys,
              onValuesChange: handleFormChange,
            }}
            onRow={handleRow}
          />
        </div>
      </div>
    </>
  );
};

export default SubItem;
