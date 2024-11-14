import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Space,
  Form,
  Checkbox,
  InputNumber,
  Row,
  Col,
  Modal,
  Table,
  TableColumnType,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  TModuleStore,
  TExtAttribute,
  TAttribute,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  selectCurentSelectType,
  selectCurrentDiagramContent,
  actions,
  selectModuleUi,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { DOStatus, EDirection } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import AttributeTypeSelect from './AttributeTypeSelect';
import AttributeNameInput from './AttributeNameInput';
import styles from '../../index.less';
import { nanoid } from '@reduxjs/toolkit';
import { useSysDatatypes } from '@/pages/ComponentData/ComponentDesign/hooks';

const ExtAttribute: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const currentType = useSelector(selectCurentSelectType);
  const moduleUi = useSelector(selectModuleUi);
  const [idComponentEntity, setIdComponentEntity] = useState<string>();
  const [brief, setBrief] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [unSyncAttrs, setUnSyncAttrs] = useState<TAttribute[]>([]);
  const sysDataTypes = useSysDatatypes();
  const extAttrDataSource = useSelector(
    (state: { [x: string]: TModuleStore }) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ENTITY
      ) {
        return [];
      }
      const idElement = state[moduleName].currentSelect.idElement;
      return (
        state[moduleName].component.componentEntities
          ?.find((entityFind) => entityFind?.idComponentEntity === idElement)
          ?.extAttributes?.filter(
            (entityAttr) => entityAttr.action !== DOStatus.DELETED,
          ) || []
      );
    },
  );

  const attrs = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return [];
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return (
      state[moduleName].component.componentEntities?.find(
        (entityFind) => entityFind?.idComponentEntity === idElement,
      )?.ddEntity?.attributes || []
    );
  });

  useEffect(() => {
    if (currentType !== EnumConcreteDiagramType.ENTITY) {
      return;
    }
    const idElement = currentDiagramContent;
    if (idComponentEntity !== idElement) {
      setEditableRowKeys([]);
    }
    setIdComponentEntity(idElement);
  }, [currentDiagramContent]);

  const tableColumns: ProColumns<TExtAttribute>[] = useMemo(() => {
    const baseColumns: ProColumns<TExtAttribute>[] = [
      {
        editable: false,
        title: '序号',
        dataIndex: 'sn',
        width: '50px',
        renderFormItem: (_schema, config) => {
          return <InputNumber />;
        },
      },
      {
        editable: false,
        title: 'P',
        dataIndex: 'fgPrimaryKey',
        width: '50px',
        render: (text, record, _, action) => (
          <>{record?.attribute?.fgPrimaryKey ? '是' : ''}</>
        ),
      },
      {
        editable: false,
        title: 'M',
        dataIndex: 'fgMandatory',
        width: '50px',
        valueType: 'checkbox',
        formItemProps: { valuePropName: 'checked' },
        renderFormItem: (_schema, config) => {
          return <Checkbox />;
        },
        render: (text, record, _, action) => {
          return record?.attribute?.fgMandatory ? '是' : '否';
        },
      },
      {
        title: 'Name',
        dataIndex: 'displayName',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        renderFormItem: (_schema, config) => {
          //从config.record获取不到经过renderFormItem的属性
          const extAttribute = extAttrDataSource.find(
            (attrData) => attrData.idExtAttribute === config.recordKey,
          );
          return extAttribute?.attribute?.displayName;
        },
        render: (text, record, _, action) => (
          <>{record?.attribute?.displayName}</>
        ),
      },
      {
        editable: false,
        title: 'Code',
        dataIndex: 'columnName',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        render: (text, record, _, action) => (
          <>{record?.attribute?.columnName}</>
        ),
      },
      {
        title: () => {
          return <span>{'属性名称'}</span>;
        },
        editable: false,
        dataIndex: 'attributeName',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        renderFormItem: (_schema, config) => {
          //从config.record获取不到经过renderFormItem的属性
          const extAttribute = extAttrDataSource.find(
            (attrData) => attrData.idExtAttribute === config.recordKey,
          );
          return <AttributeNameInput {...extAttribute!} />;
        },
        render: (_dom, record) => {
          const extAttribute = extAttrDataSource.find(
            (attrData) => attrData.idExtAttribute === record.idExtAttribute,
          );
          return <span>{extAttribute?.attribute?.attributeName}</span>;
        },
      },
      {
        editable: false,
        title: '数据类型',
        dataIndex: 'idAttributeType',
        // valueType: 'select',
        renderFormItem: (_schema, config) => {
          //从config.record获取不到经过renderFormItem的属性
          const attribute = extAttrDataSource.find(
            (attrData) => attrData.idExtAttribute === config.recordKey,
          );
          return <AttributeTypeSelect {...attribute} />;
        },
        render: (_dom, record) => {
          let dataType = sysDataTypes?.find(
            (dataType) =>
              record?.attribute?.idAttributeType === dataType.idDataType,
          );
          return <>{dataType?.displayName}</>;
        },
      },
      {
        editable: false,
        title: '字段描述',
        dataIndex: 'note',
        render: (text, record, _, action) => <>{record?.attribute?.note}</>,
      },
    ];
    const moreColumns: ProColumns<TExtAttribute>[] = [
      {
        editable: false,
        title: '长度',
        dataIndex: 'len',
        renderFormItem: (_schema, config) => {
          return <InputNumber />;
        },
        render: (text, record, _, action) => <>{record?.attribute?.len}</>,
      },
      {
        editable: false,
        title: '精度',
        dataIndex: 'pcs',
        renderFormItem: (_schema, config) => {
          return <InputNumber />;
        },
        render: (text, record, _, action) => <>{record?.attribute?.pcs}</>,
      },
      {
        editable: false,
        title: '默认值',
        dataIndex: 'defaultValue',
        render: (text, record, _, action) => (
          <>{record?.attribute?.defaultValue}</>
        ),
      },
    ];
    return brief ? baseColumns : baseColumns.concat(moreColumns);
  }, [brief, extAttrDataSource]);

  const attrColumns: TableColumnType<TAttribute>[] = [
    {
      dataIndex: 'sn',
      title: '序号',
      width: '50px',
    },
    {
      dataIndex: 'columnName',
      title: '字段名',
    },
    {
      dataIndex: 'displayName',
      title: '显示名称',
    },
  ];

  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TExtAttribute,
    dataSource: TExtAttribute[],
  ) => void = (record: TExtAttribute, dataSource: TExtAttribute[]) => {
    // dispatch(actions.updateExtAttribute(record));
  };
  /**行操作 */
  const handleRow = (record: TExtAttribute) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idExtAttribute!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**切换显示字段 */
  const handleToggleColumns = () => {
    setBrief(!brief);
  };

  /**切换显示字段 */
  const handleDelete = () => {
    const extAttribte = extAttrDataSource.find(
      (extAttr) => extAttr.idExtAttribute === editableKeys[0],
    );
    if (extAttribte) {
      dispatch(actions.deleteExtAttribute(extAttribte));
    }
  };

  /**同步 */
  const handleAsync = () => {
    const existIds = extAttrDataSource.map(
      (extAttr) => extAttr.idAttribute || '',
    );
    const newUnSyscAttrs = attrs.filter(
      (attr) => !existIds.includes(attr.idAttribute!),
    );
    setUnSyncAttrs(newUnSyscAttrs);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认添加属性 */
  const handleExtAttrSync = () => {
    const newAttrs = unSyncAttrs.filter((attr) =>
      selectedRowKeys.includes(attr.idAttribute!),
    );
    const newExtAttrs: TExtAttribute[] = [];
    newAttrs.forEach((attr) => {
      const extAttr: TExtAttribute = {
        idExtAttribute: nanoid(),
        idAttribute: attr.idAttribute,
        idComponentEntity: idComponentEntity,
        sn: attr.sn,
        action: DOStatus.NEW,
        attribute: attr,
      };
      newExtAttrs.push(extAttr);
    });
    dispatch(actions.addExtAttribute(newExtAttrs));
    setModalVisible(false);
  };

  return (
    <>
      <Space size={2} style={{ marginBottom: '5px' }}>
        <Button size={'small'} onClick={handleAsync}>
          {'同步'}
        </Button>
        <Button
          size={'small'}
          disabled={editableKeys.length !== 1}
          onClick={handleDelete}
        >
          {'删除'}
        </Button>
        <Button size={'small'} onClick={handleToggleColumns}>
          {brief ? '更多' : '简略'}
        </Button>
      </Space>
      <EditableProTable<TExtAttribute>
        className={styles['my-ant-card-body']}
        style={{ padding: '0px' }}
        actionRef={actionRef}
        rowKey={'idExtAttribute'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 200 }}
        maxLength={5}
        recordCreatorProps={false}
        value={extAttrDataSource}
        columns={tableColumns}
        editable={{
          type: 'multiple',
          form,
          editableKeys,
          onChange: setEditableRowKeys,
          onValuesChange: handleFormChange,
        }}
        onRow={handleRow}
        pagination={{
          total: extAttrDataSource?.length,
          pageSize: extAttrDataSource?.length,
          showTotal: (total: number) => {
            return <>总数：{total}</>;
          },
        }}
      />
      <Modal
        title="选择属性"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleExtAttrSync}
        width={'800px'}
      >
        <Row>
          <Col span={24}>
            <Table
              rowKey={'idAttribute'}
              scroll={{ y: '300px' }}
              bordered={true}
              size={'small'}
              columns={attrColumns}
              dataSource={unSyncAttrs}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ExtAttribute;
