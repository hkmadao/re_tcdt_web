import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions, selectCurrentSearchRef } from '../../../store';
import { EValueType } from '@/pages/Factory/Units/common/model';

const ValueType: FC = () => {
  const { Option } = Select;
  const searchRef = useSelector(selectCurrentSearchRef);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const hanleleChange = (value: EValueType) => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, valueType: value }));
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={searchRef?.valueType}
        onChange={hanleleChange}
        placeholder={'请选择'}
        style={{ minWidth: '100px' }}
      >
        <Option value={'String'}>字符串</Option>
        <Option value={'Bool'}>布尔</Option>
        <Option value={'I32'}>32为整数</Option>
        <Option value={'I64'}>64位整数</Option>
        <Option value={'F32'}>单精度浮点数</Option>
        <Option value={'F64'}>双精度浮点数</Option>
      </Select>
    </>
  );
};

export default ValueType;
