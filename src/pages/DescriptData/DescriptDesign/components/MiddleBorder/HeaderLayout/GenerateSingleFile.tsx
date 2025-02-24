import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Tooltip,
} from 'antd';
import { useSelector } from 'react-redux';
import { CodeOutlined } from '@ant-design/icons';
import { selectEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import BaseAPI from '@/api';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { TEntity } from '../../../models';

const initFormData = {
  host: '127.0.0.1',
  password: '123456',
  user: 'root',
  port: '3306',
  metadataDb: 'information_schema',
  businessDb: 'tcdt-demo',
};

const GenerateSingleFile: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sourceCode, setSourceCode] = useState<string>();
  const [targetCode, setTargetCode] = useState<string>();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [selectedTableNames, setSelectedTableNames] = useState<string[]>([]);
  const [metaDataForm] = Form.useForm();

  useEffect(() => {
    if (sourceCode) {
      //TODO 此处没有使用sql词法分析器，使用正则做简单切割
      //1.以分号结尾分割sql语句
      const splitReg = new RegExp(';\\s*\\r?\\n', 'm');
      const sqls = sourceCode.split(splitReg);
      //2.判断sql语句是否包含选中表
      const targetSqls = sqls
        .filter((sql) => {
          const existSqls = selectedTableNames.filter((t) => {
            const reg = new RegExp(
              `^(CREATE|ALTER|DROP){1,1}\\s+TABLE\\s*(IF\\s*EXISTS\\s*)?[\`|"]?${t}[\`|"]?\\s*`,
              'igm',
            );
            const march = sql.match(reg);
            if (march && march.length > 0) {
              return true;
            }
            return false;
          });
          return existSqls.length > 0;
        })
        .map((sql) => sql + ';\r\n');
      setTargetCode(targetSqls.join('\r\n'));
    }
  }, [selectedTableNames]);

  const handleGenerate = async () => {
    if (!entityCollection.packageName) {
      message.error('请填写包名！');
      return;
    }
    if (!entityCollection.displayName) {
      message.error('请填写显示名称！');
      return;
    }
    metaDataForm.resetFields();
    setTableNames([]);
    setSelectedTableNames([]);
    setModalVisible(true);
    setSpinning(true);
    BaseAPI.GET('/entityCollection/generateSingleFile', {
      id: entityCollection.idEntityCollection,
    })
      .then((res) => {
        setSourceCode(res);
        // setTargetCode(res);
        const reg = new RegExp(
          'CREATE\\s+TABLE\\s+\\w*\\.*[`|"]?(\\w+)[`|"]?',
          'g',
        );
        const m = (res as string).match(reg);
        const tableNames =
          m?.map((mi) => {
            return mi
              .replace('CREATE TABLE ', '')
              .replaceAll('`', '')
              .replaceAll('"', '');
          }) || [];
        setTableNames(tableNames);
        setSelectedTableNames(tableNames);
        setSpinning(false);
      })
      .catch((err) => {
        setSpinning(false);
      });
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const toggleSelected = (tableName: string) => {
    return (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        setSelectedTableNames([...selectedTableNames, tableName]);
        return;
      }
      setSelectedTableNames(selectedTableNames.filter((t) => t !== tableName));
    };
  };

  const toggleAllSelected = () => {
    if (
      selectedTableNames.length > 0 &&
      selectedTableNames.length === tableNames.length
    ) {
      setSelectedTableNames([]);
      return;
    }
    setSelectedTableNames(tableNames.slice(0));
  };

  const searchTableInfos = async () => {
    const param = await metaDataForm.validateFields();
    if (!window.tcdtAPI) {
      message.info('网页版不支持此功能！');
      return;
    }
    setSpinning(true);
    param.database = param.metadataDb;
    param.tableSchema = param.businessDb;
    window.tcdtAPI
      ?.findDbTables({ ...param })
      .then((result: TEntity[]) => {
        if (result) {
          const existTableNames = result.map((enti) => enti.tableName!);
          setSelectedTableNames(
            tableNames.filter((tn) => !existTableNames.includes(tn)),
          );
        }
        setSpinning(false);
      })
      .catch((e: Error) => {
        message.error(e.message);
        setSpinning(false);
      });
  };

  const handleLoadTables = () => {
    searchTableInfos();
  };

  const handleExecuteSql = async () => {
    if (!targetCode) {
      message.info('空的待执行sql！');
      return;
    }
    const param = await metaDataForm.validateFields();
    if (!window.tcdtAPI) {
      message.info('网页版不支持此功能！');
      return;
    }
    param.database = param.businessDb;
    param.executeSql = encodeURIComponent(targetCode);
    setSpinning(true);
    window.tcdtAPI
      ?.executeSql({ ...param })
      .then((result: TEntity[]) => {
        if (result) {
          searchTableInfos();
        }
        setSpinning(false);
      })
      .catch((e: Error) => {
        message.error(e.message);
        setSpinning(false);
      });
  };

  const handleExecuteCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTargetCode(e.target.value);
  };

  return (
    <>
      <Tooltip overlay={'生成sql'}>
        <Button
          onClick={handleGenerate}
          disabled={!entityCollection.idEntityCollection}
          size={'small'}
          icon={<CodeOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        width={'1400px'}
        title={'比较'}
        open={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Spin spinning={spinning}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 'auto',
                flexDirection: 'column',
                width: '1350px',
                height: '650px',
                gap: '5px',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: '0 1 auto',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <Collapse
                  style={{ padding: '0px' }}
                  bordered={false}
                  defaultActiveKey={['1']}
                >
                  <Collapse.Panel header="元数据查询" key="1">
                    <Form
                      form={metaDataForm}
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
                        <Button onClick={handleExecuteSql}>执行建表语句</Button>
                      </Form.Item>
                    </Form>
                  </Collapse.Panel>
                </Collapse>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '5px',
                  overflow: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: '0 1 40%',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>源sql</div>
                  <Input.TextArea
                    autoSize={{ minRows: 10, maxRows: 25 }}
                    value={sourceCode}
                    readOnly={true}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: '0 1 20%',
                    flexDirection: 'column',
                    gap: '5px',
                    overflow: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flex: 'auto',
                      flexDirection: 'column',
                      gap: '5px',
                      overflow: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flex: '0 1 auto',
                        flexDirection: 'row',
                        gap: '5px',
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>生成的表</div>
                      <div>
                        <Checkbox
                          indeterminate={
                            selectedTableNames.length > 0 &&
                            selectedTableNames.length < tableNames.length
                          }
                          checked={
                            selectedTableNames.length > 0 &&
                            selectedTableNames.length === tableNames.length
                          }
                          onChange={toggleAllSelected}
                        >
                          全选
                        </Checkbox>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flex: 'auto',
                        flexDirection: 'column',
                        gap: '5px',
                        overflow: 'auto',
                      }}
                    >
                      {tableNames.map((t, index) => {
                        return (
                          <div key={index}>
                            <Checkbox
                              checked={selectedTableNames.includes(t)}
                              onChange={toggleSelected(t)}
                            >
                              {t}
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: '0 1 40%',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>待执行sql</div>
                  <Input.TextArea
                    autoSize={{ minRows: 10, maxRows: 25 }}
                    value={targetCode}
                    onChange={handleExecuteCodeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default GenerateSingleFile;
