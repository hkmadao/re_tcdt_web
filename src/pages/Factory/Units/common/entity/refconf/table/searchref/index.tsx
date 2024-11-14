import { Button, Input, Modal, Select, Space, Tooltip } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { PlusOutlined, FileSearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { nanoid } from '@reduxjs/toolkit';
import { firstToLower } from '@/util/name-convent';
import styles from '@/pages/Factory/Units/common/less/styles.less';
import {
  TBillRefColumn,
  TBillRef,
  TBillSearchRef,
  TDescriptionInfo,
  EInputType,
} from '../../../../model';
import SearchAttributesSelect from './SearchAttributesSelect';
import SelectAttribute from './selectattr';
import RefConf from '../..';

const SearchRef: FC<{
  idComponentEntity?: string;
  metadata?: TDescriptionInfo;
  searchRefs?: TBillSearchRef[];
  callback?: any;
  idProject?: string;
}> = ({ idComponentEntity, metadata, searchRefs, callback, idProject }) => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [conditionList, setConditionList] = useState<TBillSearchRef[]>([]);
  const [displayValue, setDisplayValue] = useState<string>();
  const [myMetadata, setMyMetadata] = useState<TDescriptionInfo>();

  useEffect(() => {
    setMyMetadata(metadata);
  }, [metadata]);

  useEffect(() => {
    if (searchRefs) {
      setDisplayValue(JSON.stringify(searchRefs));
    }
  }, []);

  /**点击选择组件 */
  const handleToConfig = () => {
    if (searchRefs) {
      setConditionList(searchRefs);
    }
    setModalVisible(true);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  /**确认选中组件 */
  const handleOk = async () => {
    callback(conditionList ? conditionList : []);
    setDisplayValue(JSON.stringify(conditionList));
    setModalVisible(false);
  };

  const handleCe: (nodeDatas: TDescriptionInfo[]) => void = (nodeDatas) => {
    const newDataList: TBillSearchRef[] = [];
    nodeDatas.forEach((nodeData) => {
      const refData = conditionList?.find(
        (refd) => refd.attributeName === nodeData.attributeName,
      );
      if (refData) {
        return;
      }
      const newBillRefColumn: TBillSearchRef = {
        idBillSearchRef: nanoid(),
        operatorCode: 'like',
        attributeName: nodeData.fullAttributeName,
        label: nodeData?.displayName,
        searchAttributes: [nodeData?.fullAttributeName!],
        htmlInputType: 'Input',
        showOrder: 0,
      };
      //拾取器初始化配置
      let refConfig: TBillRef | undefined = undefined;
      if (nodeData.entityInfo && nodeData.fgPrimaryKey) {
        newBillRefColumn.htmlInputType = 'Ref';
        const refColumns: TBillRefColumn[] = [];
        nodeData.entityInfo?.attributes?.forEach((attr) => {
          //主属性不添加
          if (attr.fgPrimaryKey) {
            return;
          }
          //添加两个属性
          if (refColumns.length > 1) {
            return;
          }
          const refColumn: TBillRefColumn = {
            idBillRefColumn: nanoid(),
            name: attr.attributeName!,
            displayName: attr.displayName!,
            dataType: attr.dataType!,
          };
          refColumns.push(refColumn);
        });
        const pkAttr = nodeData.entityInfo?.attributes?.find(
          (attr) => attr.fgPrimaryKey,
        );
        const firstAttr = nodeData.entityInfo?.attributes?.find(
          (attr) => attr.sn === 2,
        );
        refConfig = {
          idBillRef: nanoid(),
          refStyle: 'table',
          tableRef: {
            tableMainProp: nodeData.entityInfo.pkAttributeInfo?.attributeName!,
            ceDisplayName: nodeData.entityInfo.displayName,
            dataUri:
              '/' + firstToLower(nodeData.entityInfo?.className!) + '/aqPage',
            refColumns,
          },
          backWriteProp: pkAttr
            ? pkAttr.attributeName!
            : nodeData.attributeName!,
          displayProp: firstAttr ? firstAttr.attributeName! : 'displayName',
          title: nodeData.entityInfo?.displayName!,
        };
        newBillRefColumn.refConfig = refConfig;
      }
      newDataList?.push(newBillRefColumn);
    });

    setConditionList([...conditionList, ...newDataList]);
  };

  /**添加行 */
  const handleAddRow = () => {
    const newBillRefColumn: TBillSearchRef = {
      idBillSearchRef: nanoid(),
      operatorCode: 'like',
      attributeName: 'attributeName',
      label: 'label',
      searchAttributes: ['attributeName'],
      htmlInputType: 'Input',
      showOrder: 0,
    };
    const newDataList = conditionList?.slice(0);
    newDataList?.push(newBillRefColumn);
    setConditionList(newDataList);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(
      newBillRefColumn.idBillSearchRef as React.Key,
    );
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TBillSearchRef,
    dataSource: TBillSearchRef[],
  ) => void = (record, dataSource) => {
    setConditionList(dataSource);
  };
  /**行操作 */
  const handleRow = (record: TBillSearchRef) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idBillSearchRef!);
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
      const newDataList = conditionList?.filter(
        (attr) => attr.idBillSearchRef !== id,
      );
      setConditionList(newDataList);
    }
  };

  const refColumns: ProColumns<TBillSearchRef>[] = [
    {
      width: 150,
      title: '名称',
      dataIndex: 'attributeName',
      key: 'attributeName',
      render: (text, record, _, action) => {
        return text;
      },
    },
    {
      width: 100,
      title: '操作符',
      dataIndex: 'operatorCode',
      key: 'operatorCode',
      valueType: 'select',
      initialValue: 'like',
      valueEnum: () => {
        return {
          equal: { text: '精确匹配', status: 'equal' },
          like: { text: '全模糊匹配', status: 'like' },
          leftLike: { text: '左模糊匹配', status: 'leftLike' },
          rightLike: { text: '右模糊匹配', status: 'rightLike' },
          in: { text: '在...中', status: 'in' },
        };
      },
    },
    {
      width: 150,
      title: '搜索属性',
      dataIndex: 'searchAttributes',
      key: 'searchAttributes',
      render: (text, record, _, action) => {
        return record.searchAttributes
          ? record.searchAttributes.join(',')
          : undefined;
      },
      renderFormItem: () => {
        return <SearchAttributesSelect />;
      },
    },
    {
      width: 150,
      title: '搜索框类型',
      dataIndex: 'htmlInputType',
      key: 'htmlInputType',
      valueType: 'select',
      initialValue: 'Input',
      valueEnum: () => {
        return {
          Input: { text: '输入框', status: 'Input' },
          InputNumber: { text: '数字输入框', status: 'InputNumber' },
          Text: { text: '文本', status: 'Text' },
          Checkbox: { text: '选中框', status: 'Checkbox' },
          DateTime: { text: '日期时间', status: 'DateTime' },
          Date: { text: '日期', status: 'Date' },
          Time: { text: '时间', status: 'Time' },
          Image: { text: '图片', status: 'Image' },
          Ref: { text: '引用', status: 'Ref' },
          Select: { text: '下拉框', status: 'Select' },
        };
      },
    },
    {
      width: 150,
      title: '值类型',
      dataIndex: 'valueType',
      key: 'valueType',
      valueType: 'select',
      initialValue: 'String',
      valueEnum: () => {
        return {
          String: { text: '字符串', status: 'String' },
          Bool: { text: '布尔', status: 'Bool' },
          I32: { text: '32为整数', status: 'I32' },
          I64: { text: '64位整数', status: 'I64' },
          F32: { text: '单精度浮点数', status: 'F32' },
          F64: { text: '双精度浮点数', status: 'F64' },
        };
      },
    },
    {
      width: 150,
      title: '标签名称',
      dataIndex: 'label',
      key: 'label',
      render: (text, record, _, action) => {
        return text;
      },
    },
    {
      width: 150,
      title: '枚举配置',
      dataIndex: 'valueEnums',
      key: 'valueEnums',
      render: (text, record, _, action) => {
        return text;
      },
    },
    {
      width: 150,
      title: '拾取器配置',
      dataIndex: 'refConfig',
      key: 'refConfig',
      render: (text, record, _, action) => {
        return (
          <RefConf
            value={record.refConfig}
            idProject={idProject}
            status={'view'}
          />
        );
      },
      renderFormItem: () => {
        return <RefConf idProject={idProject} status={'edit'} />;
      },
    },
  ];

  return (
    <>
      <Space size={5}>
        <span>查询配置：</span>
        <Input.Search
          size={'small'}
          value={displayValue}
          onSearch={handleToConfig}
          enterButton
        />
      </Space>
      <Modal
        title="查询配置"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleOk}
        width={'800px'}
      >
        <div style={{ display: 'flex' }}>
          <Space size={10} direction={'vertical'} style={{ overflow: 'auto' }}>
            <Space size={2}>
              <SelectAttribute
                idComponentEntity={idComponentEntity}
                metadata={myMetadata}
                callback={handleCe}
              />
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
            <div style={{ overflow: 'auto' }}>
              <EditableProTable<TBillSearchRef>
                className={classNames(styles['my-ant-card-body'])}
                actionRef={actionRef}
                rowKey={'idBillSearchRef'}
                headerTitle={false}
                bordered={true}
                size={'small'}
                scroll={{ x: '500px', y: '300px' }}
                maxLength={5}
                recordCreatorProps={false}
                value={conditionList}
                columns={refColumns}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  onValuesChange: handleFormChange,
                }}
                onRow={handleRow}
              />
            </div>
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default SearchRef;
