import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions, selectCurrentSearchRef } from '../../../store';
import { EInputType } from '@/pages/Factory/Units/common/model';

const HtmlInputType: FC = () => {
  const { Option } = Select;
  const searchRef = useSelector(selectCurrentSearchRef);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleChange = (value: EInputType) => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, htmlInputType: value }));
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={searchRef?.htmlInputType}
        onChange={handleChange}
        placeholder={'请选择'}
        style={{ minWidth: '100px' }}
      >
        <Option value={'Input'}>输入框</Option>
        <Option value={'InputNumber'}>数字输入框</Option>
        <Option value={'Text'}>文本</Option>
        <Option value={'Checkbox'}>选中框</Option>
        <Option value={'DateTime'}>日期时间</Option>
        <Option value={'Date'}>日期</Option>
        <Option value={'Time'}>时间</Option>
        <Option value={'Image'}>图片</Option>
        <Option value={'Ref'}>引用</Option>
        <Option value={'Select'}>下拉框</Option>
      </Select>
    </>
  );
};

export default HtmlInputType;
