import { Button, Collapse } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { TAttribute, TModuleType } from '@/pages/Factory/common/model';
import { nanoid } from '@reduxjs/toolkit';
import styles from './index.less';
import { useModles } from '@/pages/Factory/Main/hooks';

const typeColumns: ProColumns<TModuleType>[] = [
  {
    title: '序号',
    dataIndex: 'sn',
    width: '50px',
    editable: false,
    render: (text, record, index, action) => {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: 'P',
    dataIndex: 'fgMain',
    width: '50px',
    editable: false,
    // valueType: 'checkbox',
    // formItemProps: { valuePropName: 'checked' },
    renderFormItem: (_schema, config) => {
      return config.record?.fgMain ? '是' : '否';
    },
    render: (text, record, _, action) => {
      return record.fgMain ? '是' : '否';
    },
  },
  {
    title: '类名',
    dataIndex: 'className',
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
    title: '类注释名',
    dataIndex: 'displayName',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
];

const attrColumns: ProColumns<TAttribute>[] = [
  {
    title: '序号',
    dataIndex: 'sn',
    width: '50px',
    editable: false,
    render: (text, record, index, action) => {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: 'P',
    dataIndex: 'fgPk',
    width: '50px',
    editable: false,
    // valueType: 'checkbox',
    // formItemProps: { valuePropName: 'checked' },
    renderFormItem: (_schema, config) => {
      return config.record?.fgPk ? '是' : '否';
    },
    render: (text, record, _, action) => {
      return record.fgPk ? '是' : '否';
    },
  },
  {
    title: '属性名',
    dataIndex: 'attributeName',
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
    title: '属性注释名',
    dataIndex: 'displayName',
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
    title: '属性类型',
    dataIndex: 'attributeType',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
];

const ModuleType: FC<{ onResultChange: (ms: TModuleType[]) => void }> = ({
  onResultChange,
}) => {
  const { Panel } = Collapse;
  const models = useModles();
  const actionRef = useRef<ActionType>();
  const attrActionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [moduleTypes, setModuleTypes] = useState<TModuleType[]>(models);
  const [attrs, setAttrs] = useState<TAttribute[]>([]);

  useEffect(() => {
    const newTypes = moduleTypes.map((t) => {
      const pkAttr = t.attributes.find((attr) => attr.fgPk);
      return {
        ...t,
        mainProperty: pkAttr?.attributeName ?? '',
      };
    });
    onResultChange(newTypes);
  }, [moduleTypes]);

  useEffect(() => {
    const childAttrs =
      moduleTypes.find((m) => editableKeys.includes(m.id))?.attributes ?? [];
    setAttrs(childAttrs);
  }, [editableKeys]);

  /**添加行 */
  const handleAddRow = () => {
    const newType: TModuleType = {
      id: nanoid(),
      className: '',
      displayName: '',
      attributes: [],
      fgMain: false,
      mainProperty: '',
    };
    const newTyps = [...moduleTypes, newType];
    setModuleTypes(newTyps);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newType.id as React.Key);
  };

  /**设为主实体 */
  const handleSetToMain = () => {
    const newModels: TModuleType[] = JSON.parse(JSON.stringify(moduleTypes));
    newModels.forEach((m) => {
      if (m.id === editableKeys[0]) {
        m.fgMain = true;
        return;
      }
      m.fgMain = false;
    });
    setModuleTypes(newModels);
  };

  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const notDeletes = moduleTypes.filter(
        (m) => !editableKeys.includes(m.id),
      );
      setModuleTypes(notDeletes);
      setEditableRowKeys([]);
    }
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TModuleType,
    dataSource: TModuleType[],
  ) => void = (record: TModuleType, dataSource: TModuleType[]) => {
    const newModels: TModuleType[] = JSON.parse(JSON.stringify(moduleTypes));
    const toSave = newModels.map((m) => {
      if (m.id === record.id) {
        return {
          ...record,
          attributes: m.attributes,
        };
      }
      return {
        ...m,
      };
    });
    setModuleTypes(toSave);
  };
  /**行操作 */
  const handleRow = (record: TModuleType) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.id);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAttrAddRow = () => {
    const newAttr: TAttribute = {
      id: nanoid(),
      attributeName: '',
      displayName: '',
      attributeType: '',
      fgPk: false,
    };
    const newAttrs = [...attrs, newAttr];
    setAttrs(newAttrs);
    const newModels: TModuleType[] = JSON.parse(JSON.stringify(moduleTypes));
    newModels.forEach((m) => {
      if (m.id === editableKeys[0]) {
        m.attributes = newAttrs;
      }
    });
    setModuleTypes(newModels);
    attrEditableKeys.forEach((editableKey) =>
      attrActionRef.current?.cancelEditable(editableKey),
    );
    attrActionRef.current?.startEditable(newAttr.id as React.Key);
  };

  const handleSetToPk = () => {
    const newAttrs: TAttribute[] = JSON.parse(JSON.stringify(attrs));
    newAttrs.forEach((attr) => {
      if (attr.id === attrEditableKeys[0]) {
        attr.fgPk = true;
        return;
      }
      attr.fgPk = false;
    });
    setAttrs(newAttrs);
    const newModels: TModuleType[] = JSON.parse(JSON.stringify(moduleTypes));
    newModels.forEach((m) => {
      if (m.id === editableKeys[0]) {
        m.attributes = newAttrs;
      }
    });
    setModuleTypes(newModels);
  };

  /**删除行 */
  const handleAttrDelete = () => {
    if (attrEditableKeys && attrEditableKeys.length === 1) {
      const notDeletes = attrs.filter(
        (attr) => !attrEditableKeys.includes(attr.id),
      );
      setAttrs(notDeletes);
      const newModels: TModuleType[] = JSON.parse(JSON.stringify(moduleTypes));
      newModels.forEach((m) => {
        if (m.id === editableKeys[0]) {
          m.attributes = notDeletes;
        }
      });
      setModuleTypes(newModels);
      setAttrEditableRowKeys([]);
    }
  };
  /**编辑行内容改变处理 */
  const handleAttrFormChange: (
    record: TAttribute,
    dataSource: TAttribute[],
  ) => void = (record: TAttribute, dataSource: TAttribute[]) => {
    setAttrs(dataSource);
    const newModels: TModuleType[] = JSON.parse(JSON.stringify(moduleTypes));
    newModels.forEach((m) => {
      if (m.id === editableKeys[0]) {
        m.attributes = dataSource;
      }
    });
    setModuleTypes(newModels);
  };
  /**行操作 */
  const handleAttrRow = (record: TAttribute) => {
    return {
      onClick: async (_event: any) => {
        attrEditableKeys.forEach((editableKey) =>
          attrActionRef.current?.cancelEditable(editableKey),
        );
        attrActionRef.current?.startEditable(record.id);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  return (
    <>
      <Collapse defaultActiveKey={['model']}>
        <Panel header="数据模型信息" key="model">
          <div
            style={{
              height: '400px',
              display: 'flex',
              overflow: 'auto',
              gap: '10px',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button onClick={handleAddRow} size={'small'}>
                  添加
                </Button>
                <Button
                  onClick={handleSetToMain}
                  size={'small'}
                  disabled={editableKeys.length !== 1}
                >
                  设为主实体
                </Button>
                <Button onClick={handleDelete} size={'small'}>
                  删除
                </Button>
              </div>
              <EditableProTable<TModuleType>
                className={styles['my-ant-pro-table']}
                actionRef={actionRef}
                rowKey={'id'}
                headerTitle={false}
                bordered={true}
                size={'small'}
                scroll={{ y: 300 }}
                maxLength={5}
                recordCreatorProps={false}
                value={moduleTypes}
                columns={typeColumns}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  onValuesChange: handleFormChange,
                }}
                onRow={handleRow}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button onClick={handleAttrAddRow} size={'small'}>
                  添加
                </Button>
                <Button
                  onClick={handleSetToPk}
                  size={'small'}
                  disabled={attrEditableKeys.length !== 1}
                >
                  设为主属性
                </Button>
                <Button onClick={handleAttrDelete} size={'small'}>
                  删除
                </Button>
              </div>
              <EditableProTable<TAttribute>
                className={styles['my-ant-pro-table']}
                actionRef={attrActionRef}
                rowKey={'id'}
                headerTitle={false}
                bordered={true}
                size={'small'}
                scroll={{ y: 300 }}
                maxLength={5}
                recordCreatorProps={false}
                value={attrs}
                columns={attrColumns}
                editable={{
                  type: 'multiple',
                  editableKeys: attrEditableKeys,
                  onChange: setAttrEditableRowKeys,
                  onValuesChange: handleAttrFormChange,
                }}
                onRow={handleAttrRow}
              />
            </div>
          </div>
        </Panel>
      </Collapse>
    </>
  );
};

export default ModuleType;
