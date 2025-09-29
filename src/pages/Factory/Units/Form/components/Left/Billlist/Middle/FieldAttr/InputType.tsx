import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions } from '../../../../../store';
import { EInputType } from '@/pages/Factory/Units/common/model';
import { useCurrentData, useTableBillFormField } from '../../../../../hooks';

const InputType: FC = () => {
  const { Option } = Select;
  const currentData = useCurrentData();
  const tableBillFormField = useTableBillFormField();
  const dispatch = useDispatch();

  const handleChange = (value: EInputType) => {
    if (currentData) {
      dispatch(
        actions.updateTableBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...tableBillFormField, inputType: value },
        }),
      );
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={tableBillFormField?.inputType}
        onChange={handleChange}
        placeholder={'请选择'}
        style={{ minWidth: '100px' }}
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
    </>
  );
};

export default InputType;
