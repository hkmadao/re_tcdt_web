import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { EOperatorCode } from '@/models';
import { actions, selectCurrentSearchRef } from '../../../store';

const OperatorCode: FC = () => {
  const { Option } = Select;
  const searchRef = useSelector(selectCurrentSearchRef);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleChange = (value: EOperatorCode) => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, operatorCode: value }));
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={searchRef?.operatorCode}
        onChange={handleChange}
        placeholder={'请选择'}
        style={{ minWidth: '100px' }}
      >
        <Option value={'equal'}>等于</Option>
        <Option value={'like'}>模糊匹配</Option>
        <Option value={'leftLike'}>左匹配</Option>
        <Option value={'rightLike'}>右匹配</Option>
        <Option value={'greaterThan'}>大于</Option>
        <Option value={'lessThan'}>小于</Option>
        <Option value={'in'}>在...中</Option>
      </Select>
    </>
  );
};

export default OperatorCode;
