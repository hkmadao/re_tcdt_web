import { FC, useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { nanoid } from '@reduxjs/toolkit';
import { TComponentEnum } from '@/pages/ComponentData/ComponentDesign/models';
import classNames from 'classnames';
import styles from '@/pages/Factory/Units/common/less/styles.less';
import CommonAPI from '../../api';
import { TEnumColumn, TEnumRef } from '../../model';
import SelectComponentEnum from '../SelectComponentEnum';

const EnumConf: FC<{
  enumConfig?: TEnumRef;
  callback: (enumConfig: TEnumRef) => void;
}> = ({ enumConfig, callback }) => {
  const actionRef = useRef<ActionType>();
  const [enumConfigModalVisible, setRefConfigModalVisible] =
    useState<boolean>();
  const [enumDataList, setRefDataList] = useState<TEnumColumn[]>([]);
  const [displayValue, setDisplayValue] = useState<string>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [idComponentEnum, setIdComponentEnum] = useState<string>();
  const [ceDisplayName, setCeDisplayName] = useState<string>();

  useEffect(() => {
    if (enumConfig) {
      setDisplayValue(JSON.stringify(enumConfig));
      setRefDataList(enumConfig.enumColumns || []);
    } else {
      setDisplayValue(undefined);
      setRefDataList([]);
    }
  }, [enumConfig]);

  const enumColumns: ProColumns<TEnumColumn>[] = [
    {
      title: '标签',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text, record, _, action) => {
        return text;
      },
    },
    {
      title: '枚举值',
      dataIndex: 'enumValue',
      key: 'enumValue',
    },
    {
      title: '枚举编码',
      dataIndex: 'code',
      key: 'code',
    },
  ];

  const openRefConfigModal = () => {
    setRefConfigModalVisible(true);
  };

  const handleRefConfigOk = async () => {
    if (enumConfig) {
      const enumConfData: TEnumRef = {
        ...enumConfig,
        enumColumns: enumDataList,
      };
      setDisplayValue(JSON.stringify(enumConfData));
      callback(enumConfData);
      setRefConfigModalVisible(false);
    }
  };

  const handleRefConfigCancel = () => {
    setRefConfigModalVisible(false);
  };

  /**添加行 */
  const handleAddRow = () => {
    const newBillRefColumn: TEnumColumn = {
      idEnumColumn: nanoid(),
      code: 'code',
      enumValue: 'enumValue',
      displayName: 'displayName',
    };
    const newDataList = enumDataList?.slice(0);
    newDataList?.push(newBillRefColumn);
    setRefDataList(newDataList);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(
      newBillRefColumn.idEnumColumn as React.Key,
    );
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TEnumColumn,
    dataSource: TEnumColumn[],
  ) => void = (record, dataSource) => {
    setRefDataList(dataSource);
  };
  /**行操作 */
  const handleRow = (record: TEnumColumn) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idEnumColumn);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const id = editableKeys[0];
      const newDataList = enumDataList?.filter(
        (attr) => attr.idEnumColumn !== id,
      );
      setRefDataList(newDataList);
    }
  };

  useEffect(() => {
    if (idComponentEnum) {
      CommonAPI.getCompnentEnumDetal({ id: idComponentEnum }).then(
        (componentEnum: TComponentEnum) => {
          let newEnumDataList: TEnumColumn[] = [];
          componentEnum.ddEnum?.attributes?.forEach((enumAttr) => {
            newEnumDataList.push({
              idEnumColumn: nanoid(),
              enumValue: enumAttr.enumValue!,
              displayName: enumAttr.displayName!,
              code: enumAttr.code,
            });
          });
        },
      );
    }
  }, [idComponentEnum]);

  const handleCe: (idComponentEnum: string, ceDisplayName: string) => void = (
    idComponentEnum,
    ceDisplayName,
  ) => {
    setIdComponentEnum(idComponentEnum);
    setCeDisplayName(ceDisplayName);
  };

  return (
    <>
      <Input.Search
        size={'small'}
        value={displayValue}
        onSearch={openRefConfigModal}
        enterButton
      />
      <Modal
        title="枚举配置"
        open={enumConfigModalVisible}
        onOk={handleRefConfigOk}
        onCancel={handleRefConfigCancel}
      >
        <Space size={10} direction={'vertical'}>
          <SelectComponentEnum
            filterProjectIds={[]}
            displayName={ceDisplayName}
            callback={handleCe}
          />
          <Space size={2}>
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
              disabled={!editableKeys || editableKeys.length == 0}
            >
              删除
            </Button>
          </Space>
          <EditableProTable<TEnumColumn>
            className={classNames(styles['my-ant-card-body'])}
            actionRef={actionRef}
            rowKey={'idBillValueEnum'}
            headerTitle={false}
            bordered={true}
            size={'small'}
            scroll={{ x: '300px', y: '150px' }}
            maxLength={5}
            recordCreatorProps={false}
            value={enumDataList}
            columns={enumColumns}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              onValuesChange: handleFormChange,
            }}
            onRow={handleRow}
          />
        </Space>
      </Modal>
    </>
  );
};
export default EnumConf;
