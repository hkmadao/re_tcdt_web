import { Button, Input, InputRef, message, Popover } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { nanoid } from '@reduxjs/toolkit';
import styles from './index.less';
import {
  TEnum,
  TEnumAttribute,
} from '@/pages/DescriptData/DescriptDesign/models';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import { useDispatch } from 'react-redux';
import {
  useIdCollection,
  useLoadStatus,
  useModuleUi,
  useNotDeleteEnums,
} from '@/pages/DescriptData/DescriptDesign/hooks';
import { DOStatus } from '@/models';

const EnumEditTable: FC = () => {
  const dispatch = useDispatch();
  const moduleUi = useModuleUi();
  const actionRef = useRef<ActionType>();
  const attrActionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [attrEditableKeys, setAttrEditableRowKeys] = useState<React.Key[]>([]);
  const [attrs, setAttrs] = useState<TEnumAttribute[]>([]);
  const { typeColumns, attrColumns } = useColumns();
  const notDeleteEnums = useNotDeleteEnums();
  const loadStatus = useLoadStatus();
  const idCollection = useIdCollection();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    setEditableRowKeys([]);
    setAttrEditableRowKeys([]);
    setAttrs([]);
    setSearchValue(undefined);
  }, [idCollection]);

  const filterEnums = useMemo(() => {
    const filterEntities = notDeleteEnums.filter((entity) => {
      if (!searchValue) {
        return true;
      }
      if (
        entity.className?.includes(searchValue) ||
        entity.displayName?.includes(searchValue)
      ) {
        return true;
      }
      return false;
    });
    return filterEntities;
  }, [notDeleteEnums]);

  const handleChange = (e: any) => {
    const searchValue = e.currentTarget.value;
    setSearchValue(searchValue);
    setEditableRowKeys([]);
  };

  useEffect(() => {
    setAttrEditableRowKeys([]);
  }, [editableKeys]);

  useEffect(() => {
    const childAttrs =
      filterEnums.find((m) => editableKeys.includes(m.idEnum))?.attributes ??
      [];
    setAttrs(childAttrs.filter((attr) => attr.action !== DOStatus.DELETED));
  }, [editableKeys, attrEditableKeys, loadStatus]);

  /**添加行 */
  const handleAddRow = () => {
    const newEntity: TEnum = {
      idEnum: nanoid(),
      className: 'NewTable' + (notDeleteEnums.length + 1),
      displayName: 'NewTable' + (notDeleteEnums.length + 1),
      attributes: [],
    };
    dispatch(actions.addEnum(newEntity));
    setSearchValue(undefined);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(newEntity.idEnum as React.Key);
  };

  /**编辑行内容改变处理 */
  const handleFormChange: (record: TEnum, dataSource: TEnum[]) => void = (
    record: TEnum,
    dataSource: TEnum[],
  ) => {
    dispatch(actions.updateEnum(record));
  };
  /**行操作 */
  const handleRow = (record: TEnum) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idEnum);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAttrAddRow = () => {
    const findEntity = filterEnums.find((entity) =>
      editableKeys.includes(entity.idEnum),
    );
    if (!findEntity) {
      message.error('找不到枚举');
    }
    const newAttr: TEnumAttribute = {
      idEnum: findEntity?.idEnum,
      idEnumAttribute: nanoid(),
      code: 'Code' + (attrs.length + 1),
      displayName: 'displayName' + (attrs.length + 1),
    };

    dispatch(actions.addEnumAttribute(newAttr));
    attrEditableKeys.forEach((editableKey) =>
      attrActionRef.current?.cancelEditable(editableKey),
    );
    attrActionRef.current?.startEditable(newAttr.idEnumAttribute as React.Key);
  };

  /**删除行 */
  const handleAttrDelete = () => {
    if (attrEditableKeys && attrEditableKeys.length === 1) {
      const deleteAttribute = attrs.find((attr) =>
        attrEditableKeys.includes(attr.idEnumAttribute!),
      );
      if (deleteAttribute) {
        dispatch(actions.deleteEnumAttribute(deleteAttribute));
        setAttrEditableRowKeys([]);
      }
    }
  };
  /**编辑行内容改变处理 */
  const handleAttrFormChange: (
    record: TEnumAttribute,
    dataSource: TEnumAttribute[],
  ) => void = (record: TEnumAttribute, dataSource: TEnumAttribute[]) => {
    dispatch(actions.updateEnumAttribute(record));
  };
  /**行操作 */
  const handleAttrRow = (record: TEnumAttribute) => {
    return {
      onClick: async (_event: any) => {
        attrEditableKeys.forEach((editableKey) =>
          attrActionRef.current?.cancelEditable(editableKey),
        );
        attrActionRef.current?.startEditable(record.idEnumAttribute!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          overflow: 'auto',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button
              onClick={handleAddRow}
              size={'small'}
              type={'primary'}
              disabled={!idCollection}
            >
              添加
            </Button>
            <span>
              总共
              <span
                style={{
                  color: 'blue',
                  margin: '0px 5px',
                  fontSize: '18px',
                }}
              >
                {notDeleteEnums?.length ?? 0}
              </span>
              条目，
            </span>
            <span>
              筛选出
              <span
                style={{
                  color: 'blue',
                  margin: '0px 5px',
                  fontSize: '18px',
                }}
              >
                {filterEnums.length ?? 0}
              </span>
              条目
            </span>
            <Input
              ref={searchRef}
              value={searchValue}
              size={'small'}
              style={{ width: '200px', marginLeft: '10px' }}
              placeholder="请输入过虑条件"
              onChange={handleChange}
            />
          </div>
          <EditableProTable<TEnum>
            className={styles['my-ant-pro-table']}
            actionRef={actionRef}
            rowKey={'idEnum'}
            headerTitle={false}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
            maxLength={5}
            recordCreatorProps={false}
            value={filterEnums}
            columns={typeColumns}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              onValuesChange: handleFormChange,
            }}
            onRow={handleRow}
            pagination={false}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button
              onClick={handleAttrAddRow}
              size={'small'}
              type={'primary'}
              disabled={editableKeys.length !== 1}
            >
              添加
            </Button>
            <Button
              onClick={handleAttrDelete}
              size={'small'}
              type={'primary'}
              disabled={attrEditableKeys.length !== 1}
            >
              删除
            </Button>
          </div>
          <EditableProTable<TEnumAttribute>
            className={styles['my-ant-pro-table']}
            actionRef={attrActionRef}
            rowKey={'idEnumAttribute'}
            headerTitle={false}
            bordered={true}
            size={'small'}
            scroll={{ y: (moduleUi.bHeight as number) - 160 }}
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
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default EnumEditTable;

const useColumns = () => {
  const dispatch = useDispatch();

  const typeColumns: ProColumns<TEnum>[] = [
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
      dataIndex: 'idEnum',
      title: 'ID',
      editable: false,
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => dispatch(actions.updateGoToId(content))}
              >
                {content}
              </span>
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
  ];

  const attrColumns: ProColumns<TEnumAttribute>[] = [
    {
      title: '序号',
      dataIndex: 'sn',
      width: '50px',
      editable: false,
      render: (text, record, index, action) => {
        return <span>{record.sn}</span>;
      },
    },
    {
      title: '枚举编号',
      dataIndex: 'code',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
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
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (value: any) => {
        const content = value ? value : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              maxWidth: '150px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
  ];

  return { typeColumns, attrColumns };
};
