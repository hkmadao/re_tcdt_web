import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions } from '../../../store';
import { useCurrentButton } from '../../../hooks';

const SizeSelect: FC = () => {
  const { Option } = Select;
  const searchRef = useCurrentButton();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleChange = (value: 'small' | 'middle' | 'large' | undefined) => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, buttonSize: value }));
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={searchRef?.buttonSize}
        onChange={handleChange}
        placeholder={'请选择'}
        style={{ minWidth: '100px' }}
      >
        <Option value={'small'}>小尺寸</Option>
        <Option value={'middle'}>中等尺寸</Option>
        <Option value={'large'}>大尺寸</Option>
      </Select>
    </>
  );
};

export default SizeSelect;
