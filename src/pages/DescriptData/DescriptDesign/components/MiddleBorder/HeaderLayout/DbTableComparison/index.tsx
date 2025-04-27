import { FC, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Tooltip,
  message,
} from 'antd';
import { useDispatch } from 'react-redux';
import { ColumnWidthOutlined } from '@ant-design/icons';
import { fetchFullCollection } from '@/pages/DescriptData/DescriptDesign/store';
import { TAttribute, TEntity } from '../../../../models';
import { nanoid } from '@reduxjs/toolkit';
import { useCollection, useFgChange, useLoadStatus } from '../../../../hooks';
import ComparisionEntityEditTable from './ComparisionEntityEditTable';
import { underlineToHump } from '@/util';

export type TComparisionEntity = {
  fgExistsEntity: boolean;
  fgExistsDb: boolean;
  fgSync: boolean;
  comparisionAttrs: TComparisionAttrs[];
} & Omit<TEntity, 'attributes'>;

export type TComparisionAttrs = {
  dbAttributeType?: string;
  dbColumnName?: string;
  dbNote?: string;
  fgExistsEntity: boolean;
  fgExistsDb: boolean;
  fgSync: boolean;
} & TAttribute;

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [comparisionEntities, setComparisionEntities] = useState<
    TComparisionEntity[]
  >([]);
  const [dbTableInfos, setDbTableInfos] = useState<TEntity[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const coll = useCollection();
  const [dbType, setDbType] = useState<string>('mysql');
  const fgChange = useFgChange();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleDbTypeChange = (value: string) => {
    if (value !== 'mysql') {
      message.warn('暂时只支持Mysq建表语句解析');
      return;
    }
    setDbType(value);
  };

  useEffect(() => {
    doComparisionData();
  }, [coll, dbTableInfos]);

  const searchTableInfos = async () => {
    const param = await form.validateFields();
    if (!window.tcdtAPI) {
      message.info('网页版不支持此功能！');
      return;
    }
    param.database = param.metadataDb;
    param.tableSchema = param.businessDb;
    if (window.tcdtAPI) {
      setSpinning(true);
      window.tcdtAPI
        .findDbTables({ ...param })
        .then((result: TEntity[]) => {
          if (!result || result.length === 0) {
            message.error('查询不到数据，请检查连接信息是否正确');
          }

          setDbTableInfos(result);
          setSpinning(false);
        })
        .catch((e: Error) => {
          message.error(e.message);
          setSpinning(false);
        });
    }
  };

  const doComparisionData = async () => {
    if (!coll) {
      return;
    }
    const { entities, entityAssociates } = coll;
    const comparisionEntities: TComparisionEntity[] = entities.map((entity) => {
      let comparisionEnti: TComparisionEntity = {
        ...entity,
        fgExistsEntity: true,
        fgExistsDb: false,
        fgSync: false,
        comparisionAttrs: [],
      };
      comparisionEnti.comparisionAttrs =
        entity.attributes?.map((attr) => {
          const newAttr: TComparisionAttrs = {
            ...attr,
            fgExistsEntity: true,
            fgExistsDb: false,
            fgSync: false,
          };
          return newAttr;
        }) || [];
      const assos = entityAssociates.filter(
        (asso) => entity.idEntity === asso.idDown,
      );
      //关联字段
      const assoAttrs = assos
        .filter((asso) => !!asso.fkColumnName)
        .map((asso) => {
          const attr: TComparisionAttrs = {
            idAttribute: nanoid(),
            columnName: asso.fkColumnName,
            attributeName: asso.fkAttributeName,
            note: asso.fkAttributeDisplayName ?? '',
            fgExistsEntity: true,
            fgExistsDb: false,
            fgSync: false,
          };
          return attr;
        });

      comparisionEnti.comparisionAttrs.push(...assoAttrs);
      return comparisionEnti;
    });
    const dbTableNames = dbTableInfos.map((e) => e.tableName);
    const findEntities =
      comparisionEntities?.map((entity) => {
        let comparisionEnti: TComparisionEntity = {
          ...entity,
        };
        //数据库存在的表
        if (dbTableNames.includes(entity.tableName!)) {
          comparisionEnti.fgExistsDb = true;
          comparisionEnti.fgSync = true;
          const dbEnti = dbTableInfos.find(
            (dbEntity) => entity.tableName === dbEntity.tableName,
          );
          comparisionEnti.comparisionAttrs =
            comparisionEnti.comparisionAttrs?.map((attr) => {
              const dbAttr = dbEnti?.attributes?.find(
                (da) => da.columnName === attr.columnName,
              );
              if (dbAttr) {
                //两边存在的字段
                attr.dbColumnName = dbAttr.columnName;
                attr.dbNote = dbAttr.note;
                attr.fgExistsDb = true;
                attr.fgSync = true;
              }
              return attr;
            }) || [];

          dbEnti?.attributes?.forEach((da) => {
            const attr = comparisionEnti.comparisionAttrs.find(
              (a) => a.columnName === da.columnName,
            );
            //两边存在的字段
            if (attr) {
              return;
            }
            //只有数据库存在的字段
            comparisionEnti.comparisionAttrs.push({
              idAttribute: nanoid(),
              idEntity: entity.idEntity,
              columnName: da.columnName,
              attributeName: underlineToHump(da.columnName!),
              note: da.note,
              dbColumnName: da?.columnName,
              fgExistsEntity: false,
              fgExistsDb: true,
              fgSync: false,
            });
          });
        }
        //排序
        const newAttrs = comparisionEnti.comparisionAttrs.filter(
          (a) => !a.dbColumnName,
        );
        const oldDbAttrs = comparisionEnti.comparisionAttrs.filter(
          (a) => !a.columnName,
        );
        const commonAttrs = comparisionEnti.comparisionAttrs.filter(
          (a) => !!a.columnName && !!a.dbColumnName,
        );
        comparisionEnti.comparisionAttrs = newAttrs
          .concat(oldDbAttrs)
          .concat(commonAttrs);

        return comparisionEnti;
      }) || [];

    //数据库多出来的表
    const newDbTableInfos = dbTableInfos
      .filter((dbTable) => {
        const exists = findEntities.find(
          (enti) =>
            enti.tableName?.toLocaleLowerCase() ===
            dbTable.tableName?.toLocaleLowerCase(),
        );
        return !exists;
      })
      .map((dbTable) => {
        const comparisionEnti: TComparisionEntity = {
          idEntity: nanoid(),
          tableName: dbTable.tableName,
          displayName: dbTable.displayName,
          fgExistsEntity: false,
          fgExistsDb: true,
          fgSync: false,
          comparisionAttrs: [],
        };
        comparisionEnti.comparisionAttrs =
          dbTable.attributes?.map((da) => {
            const newAttr: TComparisionAttrs = {
              idAttribute: nanoid(),
              idEntity: comparisionEnti.idEntity,
              columnName: da.columnName,
              attributeName: underlineToHump(da.columnName!),
              displayName: da.displayName,
              note: da.note,
              fgExistsEntity: false,
              fgExistsDb: true,
              fgSync: false,
            };
            return newAttr;
          }) || [];
        return comparisionEnti;
      });

    setComparisionEntities([...findEntities, ...newDbTableInfos]);
  };

  const handleLoadTables = () => {
    searchTableInfos();
  };

  const handleOpen = async () => {
    if (fgChange) {
      message.error('集合数据已修改，请先保存');
      return;
    }
    form.resetFields();
    setDbTableInfos([]);
    dispatch(fetchFullCollection({ id: coll.idEntityCollection! }));
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip
        overlay={'数据库表比对'}
        style={{ display: !window.tcdtAPI ? 'none' : undefined }}
      >
        <Button
          onClick={handleOpen}
          disabled={!coll.idEntityCollection}
          size={'small'}
          icon={
            <span>
              <ColumnWidthOutlined />
            </span>
          }
        ></Button>
      </Tooltip>
      <Modal
        width={'1200px'}
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
              // width: '1200px',
              // height: '600px',
              gap: '5px',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <Collapse style={{ padding: '0px' }} defaultActiveKey={['1']}>
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
                      <Select
                        size={'small'}
                        value={dbType}
                        style={{ minWidth: '150px' }}
                        onChange={handleDbTypeChange}
                      >
                        <Select.Option value="mysql">Mysql</Select.Option>
                        <Select.Option value="oracle">Oracle</Select.Option>
                        <Select.Option value="postgres">Postgres</Select.Option>
                        <Select.Option value="sqlserver">
                          SqlServer
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        disabled={dbTableInfos.length > 0}
                        onClick={handleLoadTables}
                      >
                        查询元数据
                      </Button>
                    </Form.Item>
                    {/* <Form.Item>
                      <Button onClick={handleReLoadEntities}>刷新</Button>
                    </Form.Item> */}
                  </Form>
                </Collapse.Panel>
              </Collapse>
            </div>
            <div style={{ flex: '0 0 1px', backgroundColor: '#c3c3c3' }}></div>
            <ComparisionEntityEditTable entitiesProps={comparisionEntities} />
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default DbTableComparison;
