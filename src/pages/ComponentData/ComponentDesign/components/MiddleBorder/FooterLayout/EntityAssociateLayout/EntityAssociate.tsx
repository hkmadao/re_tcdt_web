import { FC, Key, useEffect, useRef, useState } from 'react';
import { Button, Space, Form, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { TAttribute, TJoin } from '../../../../models';
import {
  selectCurentSelectType,
  selectCurrentDiagramContent,
} from '../../../../store';
import { selectModuleUi } from '@/pages/ComponentData/ComponentDesign/store';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';

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
    // const asso: TEntityAssociate = currentDiagramContent as TEntityAssociate;
    // if (!asso) {
    //   return;
    // }
    // const sourceEntity: TEntity = entities?.find(
    //   (entity) =>
    //     entity.action !== DOStatus.DELETED &&
    //     entity.idEntity === asso.parentEntityId,
    // )!;
    // const refAttributes: TAttribute[] = sourceEntity.attributes
    // setAttrDataSource(asso.joins!);
  }, [currentDiagramContent]);
  const attrColumns: ProColumns<TJoin>[] = [
    // {
    //   title: '外键',
    //   dataIndex: 'fk',
    //   editable: false,
    //   width: '50px',
    //   render: (text, record, _, action) => [<>{record.fk ? '是' : ''}</>],
    // },
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

  /**设为主键 */
  // const handleSetKey = () => {
  //   if (editableKeys && editableKeys.length === 1) {
  //     const entityAttr = attrDataSource.find(
  //       (entityAttr) =>
  //         entityAttr.action !== DOStatus.DELETED &&
  //         entityAttr.idAttribute === editableKeys[0].toString(),
  //     );
  //     if (entityAttr) {
  //       const record = { ...entityAttr };
  //       record.fgPrimaryKey = true;
  //       dispatch(updateCurrentDiagramAttr(record));
  //     }
  //   }
  // };

  /**添加行 */
  const handleAddRow = () => {
    const newJoin: TJoin = {
      idJoin: (Math.random() * 1000000).toFixed(0),
      action: DOStatus.NEW,
    };
    // dispatch(addCurrentDiagramAttr(newJoin));
    // editableKeys.forEach((editableKey) =>
    //   actionRef.current?.cancelEditable(editableKey),
    // );
    // actionRef.current?.startEditable(newJoin.idAttribute as React.Key);
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
  ) => {
    // if (record.fgPrimaryKey) {
    //   const newDataSource: TAttribute[] = dataSource.map((entityAttr) => {
    //     if (entityAttr.idAttribute !== record.idAttribute) {
    //       entityAttr.fgPrimaryKey = false;
    //     }
    //     return entityAttr;
    //   });
    //   setAttrDataSource(newDataSource);
    // }
    // dispatch(updateCurrentDiagramAttr(record));
  };
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
