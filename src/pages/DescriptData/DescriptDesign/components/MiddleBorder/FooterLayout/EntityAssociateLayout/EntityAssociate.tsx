import { FC, useEffect, useRef, useState } from 'react';
import { Button, Space, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { TAttribute, TJoin } from '@/pages/DescriptData/DescriptDesign/models';
import {
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
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';

const EntityAssociate: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const currentType = useSelector(selectCurentSelectType);
  const moduleUi = useSelector(selectModuleUi);
  const [attrDataSource, setAttrDataSource] = useState<TJoin[]>([]);

  useEffect(() => {
    if (currentType !== EnumConcreteDiagramType.ASSOLINK) {
      return;
    }
  }, [currentDiagramContent]);
  const attrColumns: ProColumns<TJoin>[] = [
    {
      title: '引用字段',
      dataIndex: 'name',
      width: '100px',
      valueType: 'select',
      valueEnum: {
        String: { text: 'String', status: '' },
        Integer: { text: 'Integer', status: '' },
        Long: { text: 'Long', status: '' },
        Boolean: { text: 'Boolean', status: '' },
        Float: { text: 'Float', status: '' },
        Double: { text: 'Double', status: '' },
      },
    },
    {
      title: '被引用字段',
      dataIndex: 'columnName',
      // width: '50px',
      valueType: 'select',
      valueEnum: {
        String: { text: 'String', status: '' },
        Integer: { text: 'Integer', status: '' },
        Long: { text: 'Long', status: '' },
        Boolean: { text: 'Boolean', status: '' },
        Float: { text: 'Float', status: '' },
        Double: { text: 'Double', status: '' },
      },
    },
  ];

  /**添加行 */
  const handleAddRow = () => {
    const newJoin: TJoin = {
      idJoin: (Math.random() * 1000000).toFixed(0),
      action: DOStatus.NEW,
    };
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      // dispatch(deleteCurrentDiagramAttr(editableKeys[0]));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (record: TJoin, dataSource: TJoin[]) => void = (
    record: TJoin,
    dataSource: TJoin[],
  ) => {};
  /**行操作 */
  const handleRow = (record: TJoin) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idJoin!);
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
          onClick={handleDelete}
          disabled={!editableKeys || editableKeys.length == 0}
        >
          删除
        </Button>
      </Space>
      <EditableProTable<TAttribute>
        style={{ padding: '0px', width: '350px' }}
        actionRef={actionRef}
        rowKey={'idJoin'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ y: (moduleUi.bHeight as number) - 160 }}
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
        onRow={handleRow}
      />
    </>
  );
};

export default EntityAssociate;
