import { FC, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Spin,
  Tooltip,
  message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnWidthOutlined } from '@ant-design/icons';
import { selectEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import { TEntity, TEntityCollection } from '../../../models';
import { nanoid } from '@reduxjs/toolkit';
import { useLoadStatus } from '../../../hooks';
import DescriptDataAPI from '../../../api';

type TComparisionEntity = {
  idEntity: string;
  tableName?: string;
  fgNew: boolean;
  fgSync: boolean;
  attributes: TComparisionAttrs[];
};

type TComparisionAttrs = {
  idAttribute: string;
  sourceColumnName?: string;
  targetColumnName?: string;
  note?: string;
};

const initFormData = {
  host: '127.0.0.1',
  password: '123456',
  user: 'root',
  port: '3306',
  metadataDb: 'information_schema',
  businessDb: 'tcdt-demo',
};

const DbTableComparison: FC = () => {
  const loadStatus = useLoadStatus();
  const [form] = Form.useForm();
  const { idEntityCollection } = useSelector(selectEntityCollection);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [comparisionEntities, setComparisionEntities] = useState<
    TComparisionEntity[]
  >([]);
  const [comparisionAttrs, setComparisionAttrs] = useState<TComparisionAttrs[]>(
    [],
  );
  const [selectedKey, setSelectedKey] = useState<string>();
  const [dbTableInfos, setDbTableInfos] = useState<TEntity[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [coll, setColl] = useState<TEntityCollection>();

  useEffect(() => {
    doComparisionData();
  }, [coll, dbTableInfos]);

  useEffect(() => {
    const attrs =
      comparisionEntities.find((e) => e.idEntity === selectedKey)?.attributes ||
      [];
    setComparisionAttrs(attrs);
  }, [comparisionEntities, selectedKey]);

  const searchTableInfos = async () => {
    const param = await form.validateFields();
    if (!window.tcdtAPI) {
      message.info('网页版不支持此功能！');
      return;
    }
    param.database = param.metadataDb;
    param.tableSchema = param.businessDb;
    setSpinning(true);
    window.tcdtAPI
      ?.findDbTables({ ...param })
      .then((result: TEntity[]) => {
        setDbTableInfos(result);
        setSpinning(false);
      })
      .catch((e: Error) => {
        message.error(e.message);
        setSpinning(false);
      });
  };

  const doComparisionData = async () => {
    if (!coll) {
      return;
    }
    const { entities, entityAssociates } = coll;
    const dbTableNames = dbTableInfos.map((e) => e.tableName);
    const findEntities =
      entities?.map((e) => {
        let comparisionEnti: TComparisionEntity = {
          idEntity: e.idEntity,
          tableName: e.tableName,
          fgNew: false,
          fgSync: true,
          attributes: [],
        };
        const assos = entityAssociates.filter(
          (asso) => e.idEntity === asso.idDown,
        );
        //关联字段
        const assoAttrs = assos
          .filter((asso) => !!asso.fkColumnName)
          .map((asso) => {
            return {
              idAttribute: nanoid(),
              sourceColumnName: asso.fkColumnName,
              note: asso.fkAttributeDisplayName ?? '',
              targetColumnName: undefined,
            };
          });
        //数据库不存在的表
        if (!dbTableNames.includes(e.tableName!)) {
          comparisionEnti.fgNew = true;
          comparisionEnti.attributes =
            e.attributes?.map((a) => {
              return {
                idAttribute: nanoid(),
                sourceColumnName: a.columnName,
                note: (a.displayName ?? ':') + (a.note ?? ''),
                targetColumnName: undefined,
              };
            }) || [];
          comparisionEnti.attributes.push(...assoAttrs);
        } else {
          const dbEnti = dbTableInfos.find(
            (dbE) => e.tableName === dbE.tableName,
          );
          comparisionEnti.attributes =
            e.attributes?.map((a) => {
              const dbAttr = dbEnti?.attributes?.find(
                (da) => da.columnName === a.columnName,
              );
              return {
                idAttribute: nanoid(),
                sourceColumnName: a.columnName,
                targetColumnName: dbAttr?.columnName,
              };
            }) || [];
          comparisionEnti.attributes.push(...assoAttrs);
          dbEnti?.attributes?.forEach((da) => {
            const attr = comparisionEnti.attributes.find(
              (a) => a.sourceColumnName === da.columnName,
            );
            //两边存在的字段
            if (attr) {
              attr.targetColumnName = da.columnName;
            } else {
              //只有数据库存在的字段
              comparisionEnti.attributes.push({
                idAttribute: nanoid(),
                sourceColumnName: undefined,
                targetColumnName: da?.columnName,
              });
            }
          });
        }
        //排序
        const newAttrs = comparisionEnti.attributes.filter(
          (a) => !a.targetColumnName,
        );
        const oldDbAttrs = comparisionEnti.attributes.filter(
          (a) => !a.sourceColumnName,
        );
        const commonAttrs = comparisionEnti.attributes.filter(
          (a) => !!a.sourceColumnName && !!a.targetColumnName,
        );
        comparisionEnti.attributes = newAttrs
          .concat(oldDbAttrs)
          .concat(commonAttrs);

        if (!comparisionEnti.fgNew) {
          if (newAttrs.length + oldDbAttrs.length > 0) {
            comparisionEnti.fgSync = false;
          }
        }

        return comparisionEnti;
      }) || [];

    setComparisionEntities(findEntities);
  };

  const handleLoadTables = () => {
    searchTableInfos();
  };

  const handleOpen = async () => {
    form.resetFields();
    setSelectedKey(undefined);
    setModalVisible(true);
    setDbTableInfos([]);
    if (idEntityCollection) {
      setSpinning(true);
      const coll = await DescriptDataAPI.getFullColl({
        id: idEntityCollection,
      });
      setSpinning(false);
      setColl(coll);
    }
  };

  const handleRowClick = (idEntity: string) => {
    return () => {
      setSelectedKey(idEntity);
    };
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleReLoadEntities = async () => {
    if (idEntityCollection) {
      setSpinning(true);
      const coll = await DescriptDataAPI.getFullColl({
        id: idEntityCollection,
      });
      setSpinning(false);
      setColl(coll);
    }
  };

  return (
    <>
      <Tooltip
        overlay={'数据库表比对'}
        style={{ display: !window.tcdtAPI ? 'none' : undefined }}
      >
        <Button
          onClick={handleOpen}
          disabled={!idEntityCollection}
          size={'small'}
          icon={
            <span>
              <ColumnWidthOutlined />
            </span>
          }
        ></Button>
      </Tooltip>
      <Modal
        width={'850px'}
        title={'比较'}
        open={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Spin spinning={spinning || loadStatus === 'loading'}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '800px',
              height: '600px',
              gap: '5px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
              <Collapse
                style={{ padding: '0px' }}
                bordered={false}
                defaultActiveKey={['1']}
              >
                <Collapse.Panel header="元数据查询" key="1">
                  <Form
                    form={form}
                    size={'small'}
                    layout={'inline'}
                    initialValues={initFormData}
                    labelCol={{ style: { marginBottom: '5px' } }}
                  >
                    <Form.Item
                      name={'host'}
                      label={'IP地址'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={'port'}
                      label={'端口'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={'user'}
                      label={'用户'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={'password'}
                      label={'密码'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      name={'metadataDb'}
                      label={'元数据库'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={'businessDb'}
                      label={'业务数据库'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button onClick={handleLoadTables}>查询元数据</Button>
                    </Form.Item>
                    <Form.Item>
                      <Button onClick={handleReLoadEntities}>刷新</Button>
                    </Form.Item>
                  </Form>
                </Collapse.Panel>
              </Collapse>
            </div>
            <div style={{ flex: '0 0 1px', backgroundColor: '#c3c3c3' }}></div>
            <div
              style={{
                display: 'flex',
                flex: 'auto',
                flexDirection: 'row',
                gap: '5px',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '0 1 300px',
                  gap: '5px',
                  overflow: 'auto',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>表名</div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 'auto',
                    overflow: 'auto',
                    gap: '5px',
                  }}
                >
                  {comparisionEntities.map((e) => {
                    return (
                      <div
                        key={e.idEntity}
                        onClick={handleRowClick(e.idEntity)}
                        style={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor:
                            selectedKey === e.idEntity ? '#bae7ff' : undefined,
                        }}
                      >
                        <div
                          style={{
                            display: !e.fgNew ? 'none' : undefined,
                            color: '#52c41a',
                          }}
                        >
                          *
                        </div>
                        <div
                          style={{
                            display: e.fgSync ? 'none' : undefined,
                            color: 'red',
                          }}
                        >
                          ≠
                        </div>
                        <div
                          style={{
                            display: !e.fgSync || e.fgNew ? 'none' : undefined,
                          }}
                        >
                          =
                        </div>
                        <div>{e.tableName ?? '---'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{ flex: '0 0 1px', backgroundColor: '#c3c3c3' }}
              ></div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 'auto',
                  gap: '5px',
                  overflow: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontWeight: 'bold',
                    flex: '0 1 auto',
                    gap: '5px',
                    border: '1px solid #c3c3c3',
                  }}
                >
                  <div style={{ flex: '0 1 50%' }}>源字段</div>
                  <div
                    style={{ flex: '0 0 1px', backgroundColor: '#c3c3c3' }}
                  ></div>
                  <div>数据库字段</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 'auto',
                    overflow: 'auto',
                    gap: '5px',
                  }}
                >
                  {comparisionAttrs.map((a) => {
                    return (
                      <div
                        key={a.idAttribute}
                        style={{
                          display: 'flex',
                          gap: '5px',
                          color: !a.sourceColumnName
                            ? '#ff4d4f'
                            : !a.targetColumnName
                            ? '#52c41a'
                            : undefined,
                          borderBottom: '1px solid #c3c3c3',
                        }}
                      >
                        <div style={{ flex: '0 1 50%' }}>
                          {a.sourceColumnName ?? '---'}
                        </div>
                        <div
                          style={{
                            flex: '0 0 1px',
                            backgroundColor: '#c3c3c3',
                          }}
                        ></div>
                        <div>{a.targetColumnName ?? '---'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default DbTableComparison;
