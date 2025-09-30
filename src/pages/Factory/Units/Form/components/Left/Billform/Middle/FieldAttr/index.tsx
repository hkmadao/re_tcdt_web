import { Tabs, Descriptions } from 'antd';
import { useDispatch } from 'react-redux';
import { actions } from '@/pages/Factory/Units/Form/store';
import { EAttrTypes, TTip } from '@/pages/Factory/Units/Form/model';
import {
  EInputType,
  TBillRef,
  TEnumRef,
} from '@/pages/Factory/Units/common/model';
import EnumConf from '@/pages/Factory/Units/common/entity/enumconf';
import RefConf from '@/pages/Factory/Units/common/entity/refconf';
import InputType from './InputType';
import NormalInput from './NormalInput';
import NormalInputNumber from './NormalInputNumber';
import NormalCheckbox from './NormalCheckbox';
import { useBillFormField, useCurrentData } from '../../../../../hooks';
import { FC } from 'react';

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
  width: { tipKey: 'width', tip: '宽度配置' },
  textLen: { tipKey: 'textLen', tip: '文本长度配置' },
  placeholder: { tipKey: 'placeholder', tip: '占位文本配置' },
  defaultValue: { tipKey: 'defaultValue', tip: '默认值' },
};

const FieldAttr: FC<any> = () => {
  const currentData = useCurrentData();
  const billFormField = useBillFormField();

  const { TabPane } = Tabs;
  const dispatch = useDispatch();

  const refInputHandle = async (refConf?: TBillRef) => {
    dispatch(
      actions.updateBillFormField({
        name: currentData?.name!,
        tabCode: currentData?.tabCode!,
        dto: { ...billFormField, refConfig: refConf },
      }),
    );
  };

  const enumInputHandle = async (enumConf?: TEnumRef) => {
    dispatch(
      actions.updateBillFormField({
        name: currentData?.name!,
        tabCode: currentData?.tabCode!,
        dto: { ...billFormField, enumConfig: enumConf },
      }),
    );
  };

  const handleInputTypeChange = (value: EInputType) => {
    if (currentData) {
      if (currentData?.attrType === EAttrTypes.Field) {
        dispatch(
          actions.updateBillFormField({
            name: currentData.name,
            tabCode: currentData.tabCode!,
            dto: { ...billFormField, inputType: value },
          }),
        );
      }
    }
  };

  return (
    <>
      <Tabs defaultActiveKey={'base'}>
        <TabPane key={'base'} tab={'基础'} tabKey={'base'}>
          <Descriptions column={1} bordered size={'small'}>
            <Descriptions.Item label="ID">
              {billFormField?.idBillFormField}
            </Descriptions.Item>
            <Descriptions.Item label="项目主键">
              <NormalInput attr={'name'} />
            </Descriptions.Item>
            <Descriptions.Item label="显示名称">
              <NormalInput attr={'displayName'} />
            </Descriptions.Item>
            <Descriptions.Item label="宽度">
              <NormalInputNumber attr={'width'} />
            </Descriptions.Item>
            <Descriptions.Item label="文本长度">
              <NormalInputNumber attr={'textLen'} />
            </Descriptions.Item>
            <Descriptions.Item label="占位文本">
              <NormalInput attr={'placeholder'} />
            </Descriptions.Item>
            <Descriptions.Item label="默认值">
              <NormalInput attr={'defaultValue'} />
            </Descriptions.Item>
            <Descriptions.Item label="显示顺序">
              <NormalInputNumber attr={'showOrder'} />
            </Descriptions.Item>
            <Descriptions.Item label="是否树属性">
              <NormalCheckbox attr={'fgTreeAttr'} />
            </Descriptions.Item>
            <Descriptions.Item label="是否只读">
              <NormalCheckbox attr={'readonly'} />
            </Descriptions.Item>
            <Descriptions.Item label="是否可见">
              <NormalCheckbox attr={'fgDisplay'} />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane key={'advanced'} tab={'高级'} tabKey={'advanced'}>
          <Descriptions column={1} bordered size={'small'}>
            <Descriptions.Item label="输入框类型">
              <InputType />
            </Descriptions.Item>
            <Descriptions.Item label="引用属性">
              <NormalInput attr={'refAttributeName'} />
            </Descriptions.Item>
            <Descriptions.Item label="引用设置">
              <RefConf
                value={billFormField?.refConfig}
                onChange={refInputHandle}
                status={'edit'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="枚举设置">
              <EnumConf
                enumConfig={billFormField?.enumConfig}
                callback={enumInputHandle}
              />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>
    </>
  );
};

export default FieldAttr;
