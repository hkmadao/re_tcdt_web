import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { AutoComplete, Button, Form, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-table';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { fetchStringValue, firstToLower } from '@/util';
import {
  TBillRefColumn,
  TBillSearchRef,
  TDescriptionInfo,
  TTableRef,
} from '../../../model';
import styles from '@/pages/Factory/Units/common/less/styles.less';
import SearchRef from './searchref';
import CommonAPI from '../../../api';
import SelectComponentEntity from '../../SelectComponentEntity';
import SelectAttribute from './searchref/selectattr';

type TOption = {
  lable: string;
  value: string;
  displayName?: string;
  dataType?: string;
};

// type TForm = Omit<TTableRef, 'treeRefMainKey'> & {
//   treeRefMainKey?: string[];
// };

const RightTable: (
  props: {
    tableConf?: TTableRef;
    optionCallback: (options: TOption[]) => void;
    idProject?: string;
  },
  ref: any,
) => any = ({ tableConf, optionCallback, idProject }, ref) => {
  const actionRef = useRef<ActionType>();
  const [refConfigForm] = Form.useForm<TTableRef>();
  const [refDataList, setRefDataList] = useState<TBillRefColumn[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [idComponentEntity, setIdComponentEntity] = useState<string>();
  const [ceDisplayName, setCeDisplayName] = useState<string>();
  const [searchRefs, setSearchRefs] = useState<TBillSearchRef[]>();
  const [sourceOptions, setSourceOptions] = useState<TOption[]>([]);
  const [options, setOptions] = useState<TOption[]>([]);

  const [metadata, setMetadata] = useState<TDescriptionInfo>();

  useImperativeHandle(
    ref,
    () => ({
      async getTableConf() {
        const refConfig = await refConfigForm.validateFields();
        const newRefConfig: TTableRef = {
          ...refConfig,
          idComponentEntity,
          ceDisplayName,
          treeRefMainKey: fetchStringValue(refConfig.treeRefMainKey),
        };
        newRefConfig.refColumns = refDataList;
        newRefConfig.searchRefs = searchRefs;
        return newRefConfig;
      },
    }),
    [refDataList, searchRefs],
  );

  useEffect(() => {
    setIdComponentEntity(undefined);
    refConfigForm.resetFields();
    if (tableConf) {
      refConfigForm.setFieldsValue({
        ...tableConf,
        refColumns: undefined,
        treeRefMainKey: tableConf.treeRefMainKey,
      });
      setRefDataList(tableConf.refColumns ?? []);
      setCeDisplayName(tableConf.ceDisplayName);
      setIdComponentEntity(tableConf.idComponentEntity);
    }
  }, [tableConf]);

  const refColumns: ProColumns<TBillRefColumn>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, _, action) => {
        return text;
      },
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (text, record, _, action) => {
        return text;
      },
    },
  ];

  /**添加行 */
  const handleAddRow = () => {
    const newBillRefColumn: TBillRefColumn = {
      idBillRefColumn: nanoid(),
      name: 'name1',
      displayName: 'displayName1',
      dataType: 'dataType',
    };
    const newDataList = refDataList?.slice(0);
    newDataList?.push(newBillRefColumn);
    setRefDataList(newDataList);
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(
      newBillRefColumn.idBillRefColumn as React.Key,
    );
  };
  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TBillRefColumn,
    dataSource: TBillRefColumn[],
  ) => void = (record, dataSource) => {
    setRefDataList(dataSource);
  };
  /**行操作 */
  const handleRow = (record: TBillRefColumn) => {
    return {
      onClick: async (_event: any) => {
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idBillRefColumn!);
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
      const newDataList = refDataList?.filter(
        (attr) => attr.idBillRefColumn !== id,
      );
      setRefDataList(newDataList);
    }
  };

  useEffect(() => {
    if (idComponentEntity) {
      CommonAPI.getDescriptionDataByCompEntiId({ id: idComponentEntity }).then(
        (metadata: TDescriptionInfo) => {
          setMetadata(metadata);
          const values = refConfigForm.getFieldsValue();
          const pkAttr = metadata.entityInfo?.attributes?.find(
            (extAttr) => extAttr.fgPrimaryKey,
          );
          refConfigForm.setFieldsValue({
            ...values,
            dataUri:
              '/' + firstToLower(metadata.entityInfo?.className!) + '/aqPage',
            idComponentEntity: metadata.entityInfo?.idCompEntity,
            ceDisplayName: metadata.entityInfo?.displayName,
          });
          let newOptions: TOption[] = [];
          metadata.entityInfo?.attributes?.forEach((extattr) => {
            newOptions.push({
              lable: extattr.displayName!,
              value: extattr.attributeName!,
              displayName: extattr.displayName,
              dataType: extattr.dataType,
            });
          });
          setSourceOptions(newOptions);
          optionCallback(newOptions);
        },
      );
    }
  }, [idComponentEntity]);

  const handleCe: (idComponentEntity: string, ceDisplayName: string) => void = (
    idComponentEntity,
    ceDisplayName,
  ) => {
    setIdComponentEntity(idComponentEntity);
    setCeDisplayName(ceDisplayName);
  };

  const handeldSelectedAttribute = (selectedAttrs: TDescriptionInfo[]) => {
    const newDataList = selectedAttrs.map((extAttr) => {
      const newBillRefColumn: TBillRefColumn = {
        idBillRefColumn: nanoid(),
        name: extAttr.fullAttributeName,
        displayName: extAttr.displayName,
        dataType: undefined,
      };
      return newBillRefColumn;
    });
    setRefDataList(newDataList);
  };

  const handleSearch = (searchText: string) => {
    const myOptions = sourceOptions.filter(
      (o) =>
        o.lable.indexOf(searchText) > -1 || o.value.indexOf(searchText) > -1,
    );
    setOptions(myOptions);
  };

  return (
    <>
      <div
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
          margin: '0px 20px 0px 20px',
        }}
      >
        <Space size={10} direction={'vertical'}>
          <SelectComponentEntity
            filterProjectIds={idProject ? [idProject] : []}
            displayName={ceDisplayName}
            callback={handleCe}
          />
          <Form
            size={'small'}
            className={classNames(styles['my-ant-form'])}
            form={refConfigForm}
            name="refConfig"
            autoComplete="off"
          >
            <Form.Item
              label="请求uri"
              name="dataUri"
              rules={[{ required: true, message: 'Please input dataUri!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="表格主属性"
              name="tableMainProp"
              rules={[
                {
                  required: false,
                  message: 'Please input tableMainProp!',
                },
              ]}
            >
              <AutoComplete options={options} onSearch={handleSearch} />
              {/* <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder=""
                options={options}
              /> */}
            </Form.Item>
            <Form.Item
              label="引用树的外键"
              name="treeRefMainKey"
              rules={[
                {
                  required: false,
                  message: 'Please input treeRefMainKey!',
                },
              ]}
            >
              <AutoComplete options={options} onSearch={handleSearch} />
              {/* <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder=""
                options={options}
              /> */}
            </Form.Item>
            <SearchRef
              idComponentEntity={idComponentEntity}
              metadata={metadata}
              searchRefs={tableConf?.searchRefs}
              callback={setSearchRefs}
            />
          </Form>
          <Space size={2}>
            <SelectAttribute
              idComponentEntity={idComponentEntity}
              metadata={metadata}
              callback={handeldSelectedAttribute}
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
          <EditableProTable<TBillRefColumn>
            className={classNames(styles['my-ant-card-body'])}
            actionRef={actionRef}
            rowKey={'idBillRefColumn'}
            headerTitle={false}
            bordered={true}
            size={'small'}
            scroll={{ x: '300px', y: '150px' }}
            maxLength={5}
            recordCreatorProps={false}
            value={refDataList}
            columns={refColumns}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              onValuesChange: handleFormChange,
            }}
            onRow={handleRow}
          />
        </Space>
      </div>
    </>
  );
};

export default forwardRef(RightTable);
