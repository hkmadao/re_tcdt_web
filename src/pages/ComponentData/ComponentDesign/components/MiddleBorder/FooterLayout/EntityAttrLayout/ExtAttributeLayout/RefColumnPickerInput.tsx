import { FC, Key, ReactNode, useEffect, useRef, useState } from 'react';
import { Space, Modal, Select, Form } from 'antd';
import API from '@/pages/ComponentData/ComponentDesign/api';
import { DOStatus } from '@/models/enums';
import { useSelector, useDispatch } from 'react-redux';
import {
  TExtAttribute,
  TJoinColumn,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  actions,
  selectComponentEntities,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';

/**字段 */
export type TField = {
  /**源字段id */
  sourceIdExtAttribute: string;
  /**源属性名称 */
  sourceAttributeName?: string;
  /**源字段名称 */
  sourceColumnName?: string;
  /**源名称 */
  sourceName?: string;
  /**属性名称 */
  attributeName?: string;
  /**字段名称 */
  columnName?: string;
  /**名称 */
  name?: string;
};

export type TRefColumnPickerInputProps = TExtAttribute;

const RefColumnPickerInput: FC<TRefColumnPickerInputProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const { Option } = Select;
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tableDatas, setTableDatas] = useState<TField[]>([]);
  const [options, setOptions] = useState<ReactNode[]>();
  const [selectValue, setSelectValue] = useState<any[]>();
  const dispatch = useDispatch();
  const componentEntities = useSelector(selectComponentEntities);

  const joinColumns = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return [];
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return [] as any[];
  });

  useEffect(() => {
    if (joinColumns && joinColumns.length > 0) {
      const newOptions: ReactNode[] = [];
      const newSelectValue: any[] = [];
      const newSelectRowKeysKey: Key[] = [];
      joinColumns.forEach((joinColumn: any) => {
        if (joinColumn.action === DOStatus.DELETED) {
          return;
        }
        newOptions.push(
          <Option
            key={joinColumn.idJoinColumn}
            value={joinColumn.idJoinColumn}
            label={joinColumn.attributeName}
          >
            {joinColumn.attributeName}
          </Option>,
        );
        newSelectValue.push(joinColumn.idJoinColumn);
        newSelectRowKeysKey.push(joinColumn.idRef!);
      });
      setOptions(newOptions);
      setSelectValue(newSelectValue);
      setSelectedRowKeys(newSelectRowKeysKey);
    }
  }, [joinColumns]);

  const handleSearch = () => {
    let upEntityId = props.attribute?.fkEntityAssociate?.idUp;
    if (!upEntityId) {
      return;
    }
    const extAttriubtes = componentEntities?.find(
      (componentEntity) =>
        componentEntity.action !== DOStatus.DELETED &&
        componentEntity.idEntity === upEntityId,
    )?.extAttributes;
    //本component内的实体，不用发起查询
    if (extAttriubtes) {
      let newFields: TField[] = [];
      extAttriubtes.forEach((extAttribute) => {
        if (extAttribute.attribute?.fgPrimaryKey) {
          return;
        }
        const newField = {
          sourceIdExtAttribute: extAttribute.idExtAttribute!,
          sourceAttributeName: extAttribute.attribute?.attributeName,
          sourceColumnName: extAttribute.attribute?.columnName,
          sourceName: extAttribute?.attribute?.displayName,
          attributeName: extAttribute.attribute?.attributeName,
          columnName: extAttribute.attribute?.columnName,
          name: extAttribute?.attribute?.displayName,
        };
        const joinColumnFind = joinColumns.find(
          (joinColumn: any) => joinColumn.idRef === extAttribute.idExtAttribute,
        );
        if (joinColumnFind) {
          newField.attributeName = joinColumnFind.attributeName;
          newField.columnName = joinColumnFind.columnName;
          newField.name = joinColumnFind.name;
        }
        newFields.push(newField);
      });
      console.log(newFields);
      setTableDatas(newFields);
      setIsModalVisible(true);
      return;
    }
    const param = { idEntity: upEntityId };
    API.getAttributesByEntityId(param).then(
      (resAttributes: TExtAttribute[]) => {
        if (!resAttributes) {
          return;
        }
        let newFields: TField[] = [];

        resAttributes.forEach((extAttribute) => {
          const newField = {
            sourceIdExtAttribute: extAttribute.idExtAttribute!,
            sourceAttributeName: extAttribute.attribute?.attributeName,
            sourceColumnName: extAttribute.attribute?.columnName,
            sourceName: extAttribute?.attribute?.displayName,
            attributeName: extAttribute.attribute?.attributeName,
            columnName: extAttribute.attribute?.columnName,
            name: extAttribute?.attribute?.displayName,
          };
          const joinColumnFind = joinColumns.find(
            (joinColumn: any) =>
              joinColumn.idRef === extAttribute.idExtAttribute,
          );
          if (joinColumnFind) {
            newField.attributeName = joinColumnFind.attributeName;
            newField.columnName = joinColumnFind.columnName;
            newField.name = joinColumnFind.name;
          }
          newFields.push(newField);
        });
        setTableDatas(newFields);
      },
    );
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    const selectRows = tableDatas.filter((tableData) => {
      return selectedRowKeys.includes(tableData.sourceIdExtAttribute);
    });
    if (selectRows) {
      const newJoinColumns: TJoinColumn[] = [];
      selectRows.forEach((row) => {
        newJoinColumns.push({
          idJoinColumn: '',
          attributeName: row.attributeName,
          columnName: row.columnName,
          name: row.name,
          idRef: row.sourceIdExtAttribute,
        });
      });
      dispatch(
        actions.updateJoinColumns({
          idComponentEntity: props.idComponentEntity!,
          idExtAttribute: props.idExtAttribute,
          joinColumns: newJoinColumns,
        }),
      );
    }
    //取消选中行
    form.resetFields();
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    setIsModalVisible(false);
  };

  const columns: ProColumns<TField>[] = [
    {
      editable: false,
      title: '源属性名称',
      dataIndex: 'sourceAttributeName',
      key: 'sourceAttributeName',
      render: (text, record, _, action) => <a>{text ? text : '--'}</a>,
    },
    {
      editable: false,
      title: '源名称',
      dataIndex: 'sourceName',
      key: 'sourceName',
      render: (text, record, _, action) => <a>{text ? text : '--'}</a>,
    },
    {
      editable: false,
      title: '源字段名称',
      dataIndex: 'sourceColumnName',
      key: 'sourceColumnName',
      render: (text, record, _, action) => <a>{text ? text : '--'}</a>,
    },
    {
      title: '属性名称',
      dataIndex: 'attributeName',
      key: 'attributeName',
      render: (text, record, _, action) => <a>{text ? text : '--'}</a>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, _, action) => <a>{text ? text : '--'}</a>,
    },
    {
      title: '字段名称',
      dataIndex: 'columnName',
      key: 'columnName',
      render: (text, record, _, action) => <a>{text ? text : '--'}</a>,
    },
  ];

  /**编辑行内容改变处理 */
  const handleFormChange: (record: TField, dataSource: TField[]) => void = (
    record: TField,
    dataSource: TField[],
  ) => {
    setTableDatas(dataSource);
  };

  /**行操作 */
  const handleRow = (record: TField) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.sourceIdExtAttribute!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  const handleSelectRowChange = (
    selectedRowKeys: Key[],
    selectedRows: any[],
  ) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**表格行行为 */
  const onRow = (record: TField) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        if (selectedRowKeys.includes(record.sourceIdExtAttribute)) {
          const newRowKeys = selectedRowKeys.filter(
            (k) => k !== record.sourceIdExtAttribute,
          );
          setSelectedRowKeys(newRowKeys);
        } else {
          const newRowKeys = selectedRowKeys.slice();
          newRowKeys.push(record.sourceIdExtAttribute);
          setSelectedRowKeys(newRowKeys);
        }
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Select
          style={{ minWidth: '100px' }}
          mode={'multiple'}
          // defaultValue={['a', 'b']}
          value={selectValue}
          optionLabelProp="label"
          // disabled={true}
          // allowClear
          open={false}
          onClick={handleSearch}
        >
          {options}
        </Select>
      </Space>
      <Modal
        title={'关联字段'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'800px'}
      >
        <EditableProTable<TField>
          actionRef={actionRef}
          headerTitle={false}
          bordered={true}
          maxLength={5}
          recordCreatorProps={false}
          rowKey={'sourceIdExtAttribute'}
          columns={columns}
          value={tableDatas}
          rowSelection={{
            type: 'checkbox',
            onChange: handleSelectRowChange,
            selectedRowKeys,
          }}
          scroll={{ y: '300px' }}
          editable={{
            type: 'multiple',
            form,
            editableKeys,
            onChange: setEditableRowKeys,
            onValuesChange: handleFormChange,
          }}
          onRow={handleRow}
        />
      </Modal>
    </>
  );
};

export default RefColumnPickerInput;
