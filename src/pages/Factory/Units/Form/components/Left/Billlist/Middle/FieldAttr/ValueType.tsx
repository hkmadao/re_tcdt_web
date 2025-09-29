import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions } from '../../../../../store';
import { EValueType } from '@/pages/Factory/Units/common/model';
import { useCurrentData, useTableBillFormField } from '../../../../../hooks';

const ValueType: FC = () => {
  const { Option } = Select;
  const currentData = useCurrentData();
  const tableBillFormField = useTableBillFormField();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleChange = (value: EValueType) => {
    if (currentData) {
      dispatch(
        actions.updateTableBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...tableBillFormField, valueType: value },
        }),
      );
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={tableBillFormField?.valueType}
        onChange={handleChange}
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
