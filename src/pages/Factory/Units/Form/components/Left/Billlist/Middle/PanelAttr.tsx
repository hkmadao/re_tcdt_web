import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Input, Select, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { firstToLower, firstToUpper } from '@/util/name-convent';
import {
  actions,
  selectCurrent,
  selectMetaData,
} from '@/pages/Factory/Units/Form/store';
import {
  EAttrTypes,
  TTip,
  TBillFormTab,
  EPartName,
} from '@/pages/Factory/Units/Form/model';
import styles from '@/pages/Factory/Units/Form/less/styles.less';
import { TDescriptionInfo } from '@/pages/Factory/Units/common/model';
import { nanoid } from '@reduxjs/toolkit';
import { TOrderInfo } from '../../../../model/billform-common';
import OrderConf from '@/pages/Factory/Units/common/entity/orderconf';

type TMsgMap = {
  [x: string]: TTip;
  idBillFormTab: TTip;
  tabCode: TTip;
  tabName: TTip;
  tabIndex: TTip;
};

const msgMap: TMsgMap = {
  idBillFormTab: { tipKey: 'idBillFormTab', tip: '页签ID' },
  tabCode: { tipKey: 'tabCode', tip: '页签编码' },
  tabName: { tipKey: 'tabName', tip: '页签名称' },
  tabIndex: {
    tipKey: 'tabIndex',
    tip: '控制页签的排序，可通过右键菜单的"页签重排"来调整顺序',
  },
  refType: {
    tipKey: 'refType',
    tip: '控制页签数据是否是数组类型',
  },
  orderProperty: {
    tipKey: 'tabIndex',
    tip: '控制页签数据排序的属性',
  },
  orderType: {
    tipKey: 'orderType',
    tip: '控制页签数据排序的类型',
  },
};

const PanelAttr = () => {
  const { Option } = Select;
  const currentData = useSelector(selectCurrent);
  const treeDatas = useSelector(selectMetaData);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [billFormTab, setBillFormTab] = useState<TBillFormTab>();
  const [activeItem, setActiveItem] = useState('');
  const [propertyOptions, setPropertyOptions] = useState<ReactNode[]>();
  const [metadataOptions, setMetadataOptions] = useState<ReactNode[]>();
  const [propertyArr, setPropertyArr] = useState<{ value: string }[]>([]);

  const orderInfoList = useMemo(() => {
    if (!currentData) {
      return [];
    }
    const billFormTDTO = currentData.data as TBillFormTab;
    return billFormTDTO.orderInfoList ?? [];
  }, [currentData]);

  useEffect(() => {
    if (treeDatas && treeDatas.length > 0) {
      let newOps: ReactNode[] = [];
      if (currentData?.name === EPartName.Body) {
        treeDatas[0].children?.forEach((attr) => {
          if (attr.children && attr.children.length > 0 && attr.fgPartner) {
            newOps.push(
              <Select.Option
                key={attr.fullAttributeName}
                value={attr.fullAttributeName}
              >
                {attr.attributeName}
              </Select.Option>,
            );
          }
        });
      } else {
        newOps.push(
          <Select.Option
            key={treeDatas[0].fullAttributeName}
            value={treeDatas[0].fullAttributeName}
          >
            {treeDatas[0].attributeName}
          </Select.Option>,
        );
      }
      setMetadataOptions(newOps);
    }
  }, [currentData]);

  useEffect(() => {
    if (currentData?.attrType === EAttrTypes.Panel) {
      const billFormTDTONew = currentData.data as TBillFormTab;
      setBillFormTab(billFormTDTONew);
      const newPropertyOptions: ReactNode[] = [];
      const newPropertyArr: { value: string }[] = [];
      billFormTDTONew?.billFormFields?.forEach((field) => {
        const option = (
          <Option key={field.name!} value={field.name!}>
            {field.displayName}
          </Option>
        );
        newPropertyOptions.push(option);
        const propertyStr = { value: field.name! };
        newPropertyArr.push(propertyStr);
      });
      setPropertyOptions(newPropertyOptions);
      setPropertyArr(newPropertyArr);

      form.resetFields();
      form.setFieldsValue(billFormTDTONew);
    }
  }, [currentData]);

  const handleMetaChange = (metadataAttrName?: string) => {
    if (!metadataAttrName) {
      return;
    }
    if (treeDatas && treeDatas.length > 0) {
      let md: TDescriptionInfo | undefined = undefined;
      if (currentData?.name === EPartName.Body) {
        treeDatas[0].children?.forEach((attr) => {
          if (
            attr.children &&
            attr.children.length > 0 &&
            attr.fgPartner &&
            metadataAttrName === attr.fullAttributeName
          ) {
            md = attr;
          }
        });
      } else {
        md = treeDatas[0];
      }
      if (md) {
        const values: TBillFormTab = form.getFieldsValue();
        const newvalues: TBillFormTab = {
          ...values,
          metadataAttrName: md.fullAttributeName,
          tabCode: md.attributeName,
          firstUpperTabCode: firstToUpper(md.attributeName!),
          tabName: md.displayName,
          tabAttrName: md.attributeName,
          firstUpperTabAttrName: firstToUpper(md.attributeName!),
          tabClassName: md.entityInfo?.className,
          firstLowerTabClassName: firstToLower(md.entityInfo?.className!),
          mainProperty: md.entityInfo?.pkAttributeInfo?.attributeName!,
          orderInfoList: [
            {
              idOrderInfo: nanoid(),
              orderProperty: md.entityInfo?.pkAttributeInfo?.attributeName!,
              orderType: 'ASC',
            },
          ],
          orderProperty: md.entityInfo?.pkAttributeInfo?.attributeName!,
          orderType: 'ASC',
          refType:
            md.attributeTypeCode === 'InternalArray' ? 'Array' : 'Single',
        };
        dispatch(
          actions.updateTableBillFormTab({
            name: currentData?.name!,
            dto: { ...newvalues },
          }),
        );
        setBillFormTab({ ...newvalues });
        form.setFieldsValue({ ...newvalues });
      }
    }
  };

  const hanleToggleInput = (tagetName: string) => {
    return async () => {
      if (!tagetName) {
        const validates = await form.validateFields();
        dispatch(
          actions.updateTableBillFormTab({
            name: currentData?.name!,
            dto: {
              ...billFormTab,
              ...validates,
            },
          }),
        );
        setBillFormTab({
          ...billFormTab,
          ...validates,
        });
      }
      setActiveItem(tagetName);
    };
  };

  const orderInfoHandle = async (orderInfoList: TOrderInfo[]) => {
    const validates = await form.validateFields();
    dispatch(
      actions.updateBillFormTab({
        name: currentData?.name!,
        dto: {
          ...billFormTab,
          ...validates,
          orderInfoList: orderInfoList,
        },
      }),
    );
    setBillFormTab({
      ...billFormTab,
      ...validates,
      orderInfoList: orderInfoList,
    });
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
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('idBillFormTab');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            ID
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'idBillFormTab'} noStyle={true}>
              {activeItem === 'idBillFormTab' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{billFormTab?.idBillFormTab}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={classNames(styles.attrrow)}>
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            元数据
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'metadataAttrName'} noStyle={true}>
              <Select
                allowClear
                onChange={handleMetaChange}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
              >
                {metadataOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('tabName');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            页签名称
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tabName'} noStyle={true}>
              {activeItem === 'tabName' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('tabName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.tabName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('tabCode');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            页签编码
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tabCode'} noStyle={true}>
              {activeItem === 'tabCode' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('tabCode')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.tabCode}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          // onClick={(e) => {
          //   handleClick('firstUpperTabCode');
          // }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            首字母大写编码
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'firstUpperTabCode'} noStyle={true}>
              {activeItem === 'firstUpperTabCode' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('firstUpperTabCode')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.firstUpperTabCode}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          // onClick={(e) => {
          //   handleClick('fgDefaultTab');
          // }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            是否默认页签
          </Col>
          <Col span={16}>
            <Form.Item
              name="fgDefaultTab"
              valuePropName="checked"
              noStyle={true}
            >
              <Checkbox onChange={hanleToggleInput('')} />
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('tabIndex');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            显示顺序
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tabIndex'} noStyle={true}>
              {activeItem === 'tabIndex' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('tabIndex')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.tabIndex}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={classNames(styles.attrrow)}>
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            元数据类名
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tabClassName'} noStyle={true}>
              {activeItem === 'tabClassName' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('tabClassName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.tabClassName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={classNames(styles.attrrow)}>
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            驼峰类名
          </Col>
          <Col span={16}>
            <Form.Item
              label={''}
              name={'firstLowerTabClassName'}
              noStyle={true}
            >
              {activeItem === 'firstLowerTabClassName' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('firstLowerTabClassName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.firstLowerTabClassName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={classNames(styles.attrrow)}>
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            元数据属性名
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tabAttrName'} noStyle={true}>
              {activeItem === 'tabAttrName' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('tabAttrName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.tabAttrName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={classNames(styles.attrrow)}>
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            首字母大写属性名
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'firstUpperTabAttrName'} noStyle={true}>
              {activeItem === 'firstUpperTabAttrName' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('firstUpperTabAttrName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{billFormTab?.firstUpperTabAttrName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={classNames(styles.attrrow)}>
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            主属性
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'mainProperty'} noStyle={true}>
              <Select
                onChange={hanleToggleInput('')}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
              >
                {propertyOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('refType');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            复数类型
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'refType'} noStyle={true}>
              <Select
                onChange={hanleToggleInput('')}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
              >
                <Option value={'Single'}>Single</Option>
                <Option value={'Array'}>Array</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('orderProperty');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            排序配置
          </Col>
          <Col span={16}>
            <OrderConf
              inputOptions={propertyArr}
              sourceOrderInfoList={orderInfoList}
              callback={orderInfoHandle}
            />
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('orderProperty');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            排序属性
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'orderProperty'} noStyle={true}>
              <Select
                onChange={hanleToggleInput('')}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
              >
                {propertyOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          className={classNames(styles.attrrow)}
          onClick={(e) => {
            handleClick('orderType');
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            排序类型
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'orderType'} noStyle={true}>
              <Select
                onChange={hanleToggleInput('')}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
              >
                <Option value={'ASC'}>ASC</Option>
                <Option value={'DESC'}>DESC</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default PanelAttr;
