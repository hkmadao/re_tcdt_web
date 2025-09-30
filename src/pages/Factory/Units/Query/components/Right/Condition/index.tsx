import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moduleReducerName } from '../../../conf';
import { TModuleStore } from '../../../model';
import OperatorCode from './OperatorCode';
import { Descriptions } from 'antd';
import NormalInput from './NormalInput';
import HtmlInputType from './HtmlInputType';
import SearchAttributes from './SearchAttributes';
import EnumConf from '../../../../common/entity/enumconf';
import { actions } from '../../../store';
import RefConf from '../../../../common/entity/refconf';
import { TBillRef, TEnumRef } from '@/pages/Factory/Units/common/model';
import ValueType from './ValueType';
import { useCurrentSearchRef } from '../../../hooks';

const Condition: FC = () => {
  const dispatch = useDispatch();
  const searchRef = useCurrentSearchRef();

  const handleEnumConf = (enumConfig: TEnumRef) => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, enumConfig }));
    }
  };

  const handleRefConf = (refConfig: TBillRef) => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, refConfig }));
    }
  };

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          {searchRef?.idBillSearchRef}
        </Descriptions.Item>
        <Descriptions.Item label="序号">
          {searchRef?.showOrder}
        </Descriptions.Item>
        <Descriptions.Item label="操作符">
          <OperatorCode />
        </Descriptions.Item>
        <Descriptions.Item label="标签">
          <NormalInput attr={'label'} />
        </Descriptions.Item>
        <Descriptions.Item label="属性名称">
          <NormalInput attr={'attributeName'} />
        </Descriptions.Item>
        <Descriptions.Item label="引用属性名称">
          <NormalInput attr={'refAttributeName'} />
        </Descriptions.Item>
        <Descriptions.Item label="默认值">
          <NormalInput attr={'defaultValue'} />
        </Descriptions.Item>
        <Descriptions.Item label="搜索框类型">
          <HtmlInputType />
        </Descriptions.Item>
        <Descriptions.Item label="数据类型">
          <ValueType />
        </Descriptions.Item>
        <Descriptions.Item label="搜索属性">
          <SearchAttributes />
        </Descriptions.Item>
        <Descriptions.Item label="引用配置">
          <RefConf
            value={searchRef?.refConfig}
            onChange={handleRefConf}
            status={'edit'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="枚举值">
          <EnumConf
            enumConfig={searchRef?.enumConfig}
            callback={handleEnumConf}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default Condition;
