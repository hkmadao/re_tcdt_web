import { FC, Key, ReactNode, useEffect, useRef, useState } from 'react';
import { Button, Space, Form, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import {
  TEnumAttribute,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  actions,
  selectCurentSelectType,
  selectCurrentDiagramContent,
  selectModuleUi,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { nanoid } from '@reduxjs/toolkit';
import styles from '../index.less';

const EnumAttributeLayout: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const currentType = useSelector(selectCurentSelectType);
  const moduleUi = useSelector(selectModuleUi);
  const [idEnum, setIdEnum] = useState<string>();
  const attrDataSource = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENUM
    ) {
      return [];
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return (
      state[moduleName].entityCollection.enums
        ?.find((enumFind) => enumFind.idEnum === idElement)
        ?.attributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  useEffect(() => {
    if (currentType !== EnumConcreteDiagramType.ENTITY) {
      return;
    }
    const idElement = currentDiagramContent;
    if (idEnum !== idElement) {
      setEditableRowKeys([]);
    }
    setIdEnum(idElement);
  }, [currentDiagramContent]);

  const attrColumns: ProColumns<TEnumAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      renderFormItem: (_schema, config) => {
        return <InputNumber />;
      },
    },
    {
      title: '枚举属性编码',
      dataIndex: 'code',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '枚举值',
      dataIndex: 'enumValue',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '枚举属性显示名称',
      dataIndex: 'displayName',
    },
  ];

  /**行上移 */
  const handleRowUp = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idEnumAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.enumAttrRowUp(record));
      }
    }
  };

  /**行下移 */
  const handleRowDown = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = attrDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idEnumAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.enumAttrRowDown(record));
      }
    }
  };

  /**添加行 */
  const handleAddRow = () => {
    const newEnumAttr: TEnumAttribute = {
      idEnumAttribute: nanoid(),
      idEnum: currentDiagramContent,
    };
    dispatch(actions.addEnumAttribute(newEnumAttr));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newEnumAttr.idEnumAttribute as React.Key);
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const idEnumAttribute = editableKeys[0];
      const deleteAttr = attrDataSource.find(
        (attr) =>
          attr.action !== DOStatus.DELETED &&
          attr.idEnumAttribute === idEnumAttribute,
      );
      if (!deleteAttr) {
        return;
      }
      dispatch(actions.deleteEnumAttribute(deleteAttr));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TEnumAttribute,
    dataSource: TEnumAttribute[],
  ) => void = (record: TEnumAttribute, dataSource: TEnumAttribute[]) => {
    dispatch(actions.updateEnumAttribute(record));
  };
  /**行操作 */
  const handleRow = (record: TEnumAttribute) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idEnumAttribute!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  return (
    <>
      <Space size={2}>
        <Button size={'small'} onClick={handleAddRow} icon={<PlusOutlined />}>
          添加
        </Button>
        <Button
          size={'small'}
          onClick={handleRowUp}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          上移
        </Button>
        <Button
          size={'small'}
          onClick={handleRowDown}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          下移
        </Button>
        <Button
          size={'small'}
          onClick={handleDelete}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          删除
        </Button>
      </Space>
      <EditableProTable<TEnumAttribute>
        className={styles['my-ant-card-body']}
        actionRef={actionRef}
        rowKey={'idEnumAttribute'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 200 }}
        maxLength={5}
        recordCreatorProps={false}
        value={attrDataSource}
        columns={attrColumns}
        editable={{
          type: 'multiple',
          form,
          editableKeys,
          onChange: setEditableRowKeys,
          onValuesChange: handleFormChange,
        }}
        pagination={{
          total: attrDataSource?.length,
          pageSize: attrDataSource?.length,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
        onRow={handleRow}
      />
    </>
  );
};

export default EnumAttributeLayout;
