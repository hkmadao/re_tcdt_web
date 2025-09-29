import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Select, Descriptions } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { firstToLower, firstToUpper } from '@/util/name-convent';
import { actions, selectMetaData } from '@/pages/Factory/Units/Form/store';
import {
  EAttrTypes,
  TTip,
  TBillFormTab,
  EPartName,
} from '@/pages/Factory/Units/Form/model';
import { TDescriptionInfo } from '@/pages/Factory/Units/common/model';
import OrderConf from '@/pages/Factory/Units/common/entity/orderconf';
import { TOrderInfo } from '../../../../../model/billform-common';
import { nanoid } from '@reduxjs/toolkit';
import NormalInput from './NormalInput';
import NormalCheckbox from './NormalCheckbox';
import NormalInputNumber from './NormalInputNumber';
import {
  useTableBillFormTab,
  useCurrentData,
} from '@/pages/Factory/Units/Form/hooks';

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
  const currentData = useCurrentData();
  const billFormTab = useTableBillFormTab();
  const treeDatas = useSelector(selectMetaData);
  const dispatch = useDispatch();
  const [propertyOptions, setPropertyOptions] = useState<ReactNode[]>();
  const [metadataOptions, setMetadataOptions] = useState<ReactNode[]>();
  const [propertyArr, setPropertyArr] = useState<{ value: string }[]>([]);

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
        const newvalues: TBillFormTab = {
          ...billFormTab,
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
          refType:
            md.attributeTypeCode === 'InternalArray' ? 'Array' : 'Single',
        };
        dispatch(
          actions.updateTableBillFormTab({
            name: currentData?.name!,
            dto: { ...newvalues },
          }),
        );
      }
    }
  };

  const orderInfoHandle = async (orderInfoList: TOrderInfo[]) => {
    dispatch(
      actions.updateTableBillFormTab({
        name: currentData?.name!,
        dto: {
          ...billFormTab,
          orderInfoList: orderInfoList,
        },
      }),
    );
  };

  const handleClick = (msgKey: string) => {
    dispatch(
      actions.setTip({
        tipKey: msgMap[msgKey].tipKey,
        tip: msgMap[msgKey].tip,
      }),
    );
  };

  const hanlePropertyChange = (value: string) => {
    dispatch(
      actions.updateTableBillFormTab({
        name: currentData?.name!,
        dto: {
          ...billFormTab,
          mainProperty: value,
        },
      }),
    );
  };

  const hanleRefTypeChange = (
    value: 'Ref' | 'SingleRef' | 'Single' | 'Array' | undefined,
  ) => {
    dispatch(
      actions.updateTableBillFormTab({
        name: currentData?.name!,
        dto: {
          ...billFormTab,
          refType: value,
        },
      }),
    );
  };

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="ID">
          {billFormTab?.idBillFormTab}
        </Descriptions.Item>
        <Descriptions.Item label="元数据">
          <Select
            allowClear
            value={billFormTab?.metadataAttrName}
            onChange={handleMetaChange}
            placeholder={'请选择'}
            dropdownStyle={{ minWidth: '100px' }}
          >
            {metadataOptions}
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="页签名称">
          <NormalInput attr={'tabName'} />
        </Descriptions.Item>
        <Descriptions.Item label="页签编码">
          <NormalInput attr={'tabCode'} />
        </Descriptions.Item>
        <Descriptions.Item label="首字母大写编码">
          <NormalInput attr={'firstUpperTabCode'} />
        </Descriptions.Item>
        <Descriptions.Item label="是否默认页签">
          <NormalCheckbox attr={'fgDefaultTab'} />
        </Descriptions.Item>
        <Descriptions.Item label="显示顺序">
          <NormalInputNumber attr={'tabIndex'} />
        </Descriptions.Item>
        <Descriptions.Item label="元数据类名">
          <NormalInput attr={'tabClassName'} />
        </Descriptions.Item>
        <Descriptions.Item label="驼峰类名">
          <NormalInput attr={'firstLowerTabClassName'} />
        </Descriptions.Item>
        <Descriptions.Item label="元数据属性名">
          <NormalInput attr={'tabAttrName'} />
        </Descriptions.Item>
        <Descriptions.Item label="首字母大写属性名">
          <NormalInput attr={'firstUpperTabAttrName'} />
        </Descriptions.Item>
        <Descriptions.Item label="主属性">
          <Select
            value={billFormTab?.mainProperty}
            onChange={hanlePropertyChange}
            placeholder={'请选择'}
            dropdownStyle={{ minWidth: '100px' }}
          >
            {propertyOptions}
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="复数类型">
          <Select
            value={billFormTab?.refType}
            onChange={hanleRefTypeChange}
            placeholder={'请选择'}
            dropdownStyle={{ minWidth: '100px' }}
          >
            <Option value={'Single'}>Single</Option>
            <Option value={'Array'}>Array</Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="排序配置">
          <OrderConf
            inputOptions={propertyArr}
            sourceOrderInfoList={billFormTab?.orderInfoList ?? []}
            callback={orderInfoHandle}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PanelAttr;
