import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import { actions } from '../../../../../store';
import { useTableBillFormField, useCurrentData } from '../../../../../hooks';

const NormalInputNumber: FC<{
  attr: 'width' | 'textLen' | 'showOrder';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const tableBillFormField = useTableBillFormField();
  const dispatch = useDispatch();

  const handleChange = (value: number | null) => {
    const newValue = value === null ? undefined : value;
    if (currentData) {
      dispatch(
        actions.updateTableBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...tableBillFormField, [attr]: newValue },
        }),
      );
    }
  };

  return (
    <>
      <InputNumber
        size={'small'}
        value={tableBillFormField?.[attr]}
        onChange={handleChange}
      />
    </>
  );
};

export default NormalInputNumber;
