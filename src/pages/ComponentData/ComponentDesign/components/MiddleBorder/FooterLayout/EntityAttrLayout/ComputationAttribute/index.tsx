import {
  FC,
  Key,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Space,
  Form,
  Checkbox,
  InputNumber,
  Select,
  Input,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import {
  TModuleStore,
  TComputationAttribute,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import { nanoid } from '@reduxjs/toolkit';
import AttributeTypeSelect from './AttributeTypeSelect';
import AttributeNameInput from './AttributeNameInput';
import NoteInput from './NoteInput';
import styles from '../../index.less';
import {
  actions,
  selectModuleUi,
  selectCurrentDiagramContent,
} from '@/pages/ComponentData/ComponentDesign/store';
import { elementLocalton } from '@/util';

const ComputationAttributeLayout: FC = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const moduleUi = useSelector(selectModuleUi);
  const [brief, setBrief] = useState<boolean>(true);
  const caDataSource = useSelector((state: { [x: string]: TModuleStore }) => {
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
        ?.computationAttributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || []
    );
  });

  const tableColumns: ProColumns<TComputationAttribute>[] = useMemo(() => {
    const baseColumns: ProColumns<TComputationAttribute>[] = [
      {
        title: '序号',
        dataIndex: 'sn',
        width: '50px',
        editable: false,
        render: (text, record, _, action) => {
          const eleLocal = elementLocalton(
            window.location.hash,
            record?.idComputationAttribute!,
          );
          return <span id={eleLocal.substring(1)}>{record.sn}</span>;
        },
      },
      {
        title: 'M',
        dataIndex: 'fgMandatory',
        width: '50px',
        valueType: 'checkbox',
        formItemProps: { valuePropName: 'checked' },
        renderFormItem: (_schema, config) => {
          return <Checkbox />;
        },
        render: (text, record, _, action) => {
          return record?.fgMandatory ? '是' : '否';
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
        render: (text, record, _, action) => {
          return <>{record?.displayName}</>;
        },
      },
      {
        title: () => {
          return <span>{'属性名称'}</span>;
        },
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
          const extAttribute = caDataSource.find(
            (attrData) => attrData.idComputationAttribute === config.recordKey,
          );
          return <AttributeNameInput {...extAttribute!} />;
        },
        render: (_dom, record) => {
          const extAttribute = caDataSource.find(
            (attrData) =>
              attrData.idComputationAttribute === record.idComputationAttribute,
          );
          return <span>{extAttribute?.attributeName}</span>;
        },
      },
      {
        title: '数据类型',
        dataIndex: 'idAttributeType',
        // valueType: 'select',
        renderFormItem: (_schema, config) => {
          //从config.record获取不到经过renderFormItem的属性
          const attribute = caDataSource.find(
            (attrData) => attrData.idComputationAttribute === config.recordKey,
          );
          return <AttributeTypeSelect {...attribute!} />;
        },
        render: (_dom, record) => {
          return <>{record?.attributeType?.displayName}</>;
        },
      },
      {
        title: '字段描述',
        dataIndex: 'note',
        renderFormItem: (_schema, config) => {
          //从config.record获取不到经过renderFormItem的属性
          const extAttribute = caDataSource.find(
            (attrData) => attrData.idComputationAttribute === config.recordKey,
          );
          return <NoteInput {...extAttribute!} />;
        },
        render: (_dom, record) => {
          const extAttribute = caDataSource.find(
            (attrData) =>
              attrData.idComputationAttribute === record.idComputationAttribute,
          );
          return <span>{extAttribute?.attributeName}</span>;
        },
      },
    ];
    const moreColumns: ProColumns<TComputationAttribute>[] = [
      {
        title: '长度',
        dataIndex: 'len',
        renderFormItem: (_schema, config) => {
          return <InputNumber />;
        },
        render: (text, record, _, action) => {
          return <>{record?.len}</>;
        },
      },
      {
        title: '精度',
        dataIndex: 'pcs',
        renderFormItem: (_schema, config) => {
          return <InputNumber />;
        },
        render: (text, record, _, action) => {
          return <>{record?.pcs}</>;
        },
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        render: (text, record, _, action) => {
          return <>{record?.defaultValue}</>;
        },
      },
    ];
    return brief ? baseColumns : baseColumns.concat(moreColumns);
  }, [brief, caDataSource]);

  /**设为主键 */
  const handleSetKey = () => {};

  /**行上移 */
  const handleRowUp = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = caDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idComputationAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.computationAttributeRowUp(record));
      }
    }
  };

  /**行下移 */
  const handleRowDown = () => {
    if (editableKeys && editableKeys.length === 1) {
      const entityAttr = caDataSource.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idComputationAttribute === editableKeys[0].toString(),
      );
      if (entityAttr) {
        const record = { ...entityAttr };
        dispatch(actions.computationAttributeRowDown(record));
      }
    }
  };

  /**添加行 */
  const handleAddRow = () => {
    const newEntityAttr: TComputationAttribute = {
      idComputationAttribute: nanoid(),
      idComponentEntity: currentDiagramContent,
    };
    dispatch(actions.addComputationAttribute(newEntityAttr));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(
      newEntityAttr.idComputationAttribute as React.Key,
    );
    if (caDataSource && caDataSource.length > 0) {
      const eleLocal = elementLocalton(
        window.location.hash,
        caDataSource[caDataSource.length - 1].idComputationAttribute!,
      );
      window.location.href = eleLocal;
    }
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const idComputationAttribute = editableKeys[0];
      const deleteAttr = caDataSource.find(
        (attr) =>
          attr.action !== DOStatus.DELETED &&
          attr.idComputationAttribute === idComputationAttribute,
      );
      if (!deleteAttr) {
        return;
      }
      dispatch(actions.deleteComputationAttribute(deleteAttr));
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TComputationAttribute,
    dataSource: TComputationAttribute[],
  ) => void = (
    record: TComputationAttribute,
    dataSource: TComputationAttribute[],
  ) => {
    const newAttribute = caDataSource.find((entityAttr) => {
      return (
        entityAttr.idComputationAttribute === record.idComputationAttribute
      );
    });
    //需要将特殊单元格得值合并过来
    dispatch(
      actions.updateComputationAttribute({
        ...record,
        attributeName: newAttribute?.attributeName,
        idAttributeType: newAttribute?.idAttributeType,
        note: newAttribute?.note,
      }),
    );
  };
  /**行操作 */
  const handleRow = (record: TComputationAttribute) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idComputationAttribute!);
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
        <Button size={'small'} onClick={handleToggleColumns}>
          {brief ? '更多' : '简略'}
        </Button>
      </Space>
      <div
        style={{ overflow: 'auto', height: (moduleUi.bHeight as number) - 160 }}
      >
        {/* <ExtAttributeLayout tableStatus={brief} /> */}
        <EditableProTable<TComputationAttribute>
          className={styles['my-ant-card-body']}
          style={{ padding: '0px' }}
          actionRef={actionRef}
          rowKey={'idComputationAttribute'}
          headerTitle={false}
          bordered={true}
          size={'small'}
          scroll={{ x: '500px', y: (moduleUi.bHeight as number) - 160 }}
          maxLength={5}
          recordCreatorProps={false}
          value={caDataSource}
          columns={tableColumns}
          editable={{
            type: 'multiple',
            form,
            editableKeys,
            onChange: setEditableRowKeys,
            onValuesChange: handleFormChange,
          }}
          onRow={handleRow}
        />
      </div>
    </>
  );
};

export default ComputationAttributeLayout;
