import { useEffect, useState } from 'react';
import { Form, Row, Col, Input, Tabs, Select, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import {
  actions,
  selectCurrent,
  selectIdProject,
} from '@/pages/Factory/Units/Form/store';
import {
  EAttrTypes,
  TTip,
  TBillFormField,
} from '@/pages/Factory/Units/Form/model';
import styles from '@/pages/Factory/Units/Form/less/styles.less';
import {
  EInputType,
  TBillRef,
  TEnumRef,
} from '@/pages/Factory/Units/common/model';
import EnumConf from '@/pages/Factory/Units/common/entity/enumconf';
import RefConf from '@/pages/Factory/Units/common/entity/refconf';

type TMsgMap = {
  [x: string]: TTip;
  idBillFormField: TTip;
  name: TTip;
  displayName: TTip;
  showOrder: TTip;
  dataType: TTip;
};

const msgMap: TMsgMap = {
  idBillFormField: { tipKey: 'idBillFormField', tip: '控件ID' },
  name: { tipKey: 'tabcode', tip: '用来唯一标识一个控件' },
  displayName: { tipKey: 'tabname', tip: '控件的标签显示名称' },
  showOrder: {
    tipKey: 'tabindex',
    tip: '控制在流式布局中控件的显示顺序，同时影响',
  },
  dataType: { tipKey: 'dataType', tip: '数据的类型，自定义控件可修改' },
  refConfig: { tipKey: 'refConfig', tip: '引用配置' },
  enumConfig: { tipKey: 'enumConfig', tip: '枚举配置' },
};

const FieldAttr = () => {
  // const findEntityInfo: (
  //   treeDatas: TTreeData[],
  //   idBillFormField: string,
  // ) => TEntityInfo | undefined = (
  //   treeDatas: TTreeData[],
  //   idBillFormField: string,
  // ) => {
  //     for (let i = 0; i < treeDatas.length; i++) {
  //       const treeData = treeDatas[i];
  //       if (treeData.id === idBillFormField) {
  //         return treeData.entityInfo;
  //       }
  //       if (treeData.children) {
  //         const entityInfo = findEntityInfo(treeData.children, idBillFormField);
  //         if (entityInfo) {
  //           return entityInfo;
  //         }
  //       }
  //     }
  //   };

  const currentData = useSelector(selectCurrent);
  const idProject = useSelector(selectIdProject);

  const { TabPane } = Tabs;
  const { Option } = Select;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [billFormField, setBillFormField] = useState<TBillFormField>();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    if (currentData?.attrType === EAttrTypes.Field) {
      const billFormBDTONew = currentData.data as TBillFormField;
      setBillFormField(billFormBDTONew);
      form.resetFields();
      form.setFieldsValue(billFormBDTONew);
    }
  }, [currentData]);

  const hanleToggleInput = (tagetName: string) => {
    return async () => {
      if (!tagetName) {
        const validates = await form.validateFields();
        dispatch(
          actions.updateTableBillFormField({
            name: currentData?.name!,
            tabCode: currentData?.tabCode!,
            dto: { ...billFormField, ...validates },
          }),
        );
        setBillFormField({ ...billFormField, ...validates });
      }
      setActiveItem(tagetName);
    };
  };

  const refInputHandle = async (refConf?: TBillRef) => {
    const validates = await form.validateFields();
    dispatch(
      actions.updateTableBillFormField({
        name: currentData?.name!,
        tabCode: currentData?.tabCode!,
        dto: { ...billFormField, ...validates, refConfig: refConf },
      }),
    );
    setBillFormField({ ...billFormField, ...validates, refConfig: refConf });
  };

  const enumInputHandle = async (enumConf?: TEnumRef) => {
    const validates = await form.validateFields();
    dispatch(
      actions.updateTableBillFormField({
        name: currentData?.name!,
        tabCode: currentData?.tabCode!,
        dto: { ...billFormField, ...validates, enumConfig: enumConf },
      }),
    );
    setBillFormField({ ...billFormField, ...validates, enumConfig: enumConf });
  };

  const handleClick = (msgKey: string) => {
    dispatch(
      actions.setTip({
        tipKey: msgMap[msgKey].tipKey,
        tip: msgMap[msgKey].tip,
      }),
    );
  };

  return (
    <>
      <Form
        form={form}
        colon={false}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        labelAlign={'left'}
        size={'small'}
      >
        <Tabs defaultActiveKey={'base'}>
          <TabPane key={'base'} tab={'基础'} tabKey={'base'}>
            <Row
              className={classNames(styles.attrrow)}
              onClick={(e) => {
                handleClick('idBillFormField');
              }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                ID
              </Col>
              <Col span={16}>
                <Form.Item label={''} name={'idBillFormField'} noStyle={true}>
                  {activeItem === 'idBillFormField' ? (
                    <Input readOnly={true} />
                  ) : (
                    <Row>
                      <Col span={24}>{billFormField?.idBillFormField}</Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              onClick={(e) => {
                handleClick('name');
              }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                项目主键
              </Col>
              <Col span={16}>
                <Form.Item label={''} name={'name'} noStyle={true}>
                  {activeItem === 'name' ? (
                    <Input autoFocus onBlur={hanleToggleInput('')} />
                  ) : (
                    <Row
                      onClick={hanleToggleInput('name')}
                      style={{ cursor: 'pointer', height: '16px' }}
                    >
                      <Col span={24}>{billFormField?.name}</Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              onClick={(e) => {
                handleClick('displayName');
              }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                显示名称
              </Col>
              <Col span={16}>
                <Form.Item label={''} name={'displayName'} noStyle={true}>
                  {activeItem === 'displayName' ? (
                    <Input autoFocus onBlur={hanleToggleInput('')} />
                  ) : (
                    <Row
                      onClick={hanleToggleInput('displayName')}
                      style={{ cursor: 'pointer', height: '16px' }}
                    >
                      <Col span={24}>{billFormField?.displayName}</Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              onClick={(e) => {
                handleClick('showOrder');
              }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                显示顺序
              </Col>
              <Col span={16}>
                <Form.Item label={''} name={'showOrder'} noStyle={true}>
                  {activeItem === 'showOrder' ? (
                    <Input autoFocus onBlur={hanleToggleInput('')} />
                  ) : (
                    <Row
                      onClick={hanleToggleInput('showOrder')}
                      style={{ cursor: 'pointer', height: '16px' }}
                    >
                      <Col span={24}>{billFormField?.showOrder}</Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              // onClick={(e) => {
              //   handleClick('fgTreeAttr');
              // }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                是否树属性
              </Col>
              <Col span={16}>
                <Form.Item
                  name="fgTreeAttr"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={hanleToggleInput('')} />
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              // onClick={(e) => {
              //   handleClick('fgTreeAttr');
              // }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                是否只读
              </Col>
              <Col span={16}>
                <Form.Item
                  name="readonly"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={hanleToggleInput('')} />
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              // onClick={(e) => {
              //   handleClick('fgTreeAttr');
              // }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                是否可见
              </Col>
              <Col span={16}>
                <Form.Item
                  name="fgDisplay"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={hanleToggleInput('')} />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane key={'advanced'} tab={'高级'} tabKey={'advanced'}>
            <Row
              className={classNames(styles.attrrow)}
              // onClick={(e) => {
              //   handleClick('inputType');
              // }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                数据类型
              </Col>
              <Col span={16}>
                <Form.Item label={''} name={'inputType'} noStyle={true}>
                  <Select
                    onChange={hanleToggleInput('')}
                    placeholder={'请选择'}
                    dropdownStyle={{ minWidth: '100px' }}
                  >
                    <Option value={'Input'}>{'Input'}</Option>
                    <Option value={'InputNumber'}>{'InputNumber'}</Option>
                    <Option value={'Text'}>{'Text'}</Option>
                    <Option value={'Checkbox'}>{'Checkbox'}</Option>
                    <Option value={'DateTime'}>{'DateTime'}</Option>
                    <Option value={'Date'}>{'Date'}</Option>
                    <Option value={'Time'}>{'Time'}</Option>
                    <Option value={'Image'}>{'Image'}</Option>
                    <Option value={'File'}>{'File'}</Option>
                    <Option value={'Ref'}>{'Ref'}</Option>
                    <Option value={'Select'}>{'Select'}</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              // onClick={(e) => {
              //   handleClick('refAttributeName');
              // }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                引用属性
              </Col>
              <Col span={16}>
                <Form.Item label={''} name={'refAttributeName'} noStyle={true}>
                  {activeItem === 'refAttributeName' ? (
                    <Input autoFocus onBlur={hanleToggleInput('')} />
                  ) : (
                    <Row
                      onClick={hanleToggleInput('refAttributeName')}
                      style={{ cursor: 'pointer', height: '16px' }}
                    >
                      <Col span={24}>{billFormField?.refAttributeName}</Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              onClick={(e) => {
                handleClick('refConfig');
              }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                引用设置
              </Col>
              <Col span={16}>
                <RefConf
                  value={billFormField?.refConfig}
                  onChange={refInputHandle}
                  status={'edit'}
                />
              </Col>
            </Row>
            <Row
              className={classNames(styles.attrrow)}
              onClick={(e) => {
                handleClick('enumConfig');
              }}
            >
              <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
                枚举设置
              </Col>
              <Col span={16}>
                <EnumConf
                  enumConfig={billFormField?.enumConfig}
                  callback={enumInputHandle}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
    </>
  );
};

export default FieldAttr;
