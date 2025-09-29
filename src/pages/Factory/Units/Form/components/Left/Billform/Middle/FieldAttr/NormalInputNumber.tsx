import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import { actions } from '../../../../../store';
import { useBillFormField, useCurrentData } from '../../../../../hooks';

const NormalInputNumber: FC<{
  attr: 'width' | 'textLen' | 'showOrder';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormField = useBillFormField();
  const dispatch = useDispatch();

  const handleChange = (value: number | null) => {
    const newValue = value === null ? undefined : value;
    if (currentData) {
      dispatch(
        actions.updateBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...billFormField, [attr]: newValue },
        }),
      );
    }
  };

  return (
    <>
      <InputNumber
        size={'small'}
        value={billFormField?.[attr]}
        onChange={handleChange}
      />
    </>
  );
};

export default NormalInputNumber;
