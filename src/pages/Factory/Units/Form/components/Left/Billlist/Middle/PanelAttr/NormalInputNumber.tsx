import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import { actions } from '../../../../../store';
import { useTableBillFormTab, useCurrentData } from '../../../../../hooks';

const NormalInputNumber: FC<{
  attr: 'tabIndex';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormTab = useTableBillFormTab();
  const dispatch = useDispatch();

  const handleChange = (value: number | null) => {
    const newValue = value === null ? undefined : value;
    if (currentData) {
      dispatch(
        actions.updateTableBillFormTab({
          name: currentData.name,
          dto: { ...billFormTab, [attr]: newValue },
        }),
      );
    }
  };

  return (
    <>
      <InputNumber
        size={'small'}
        value={billFormTab?.[attr]}
        onChange={handleChange}
      />
    </>
  );
};

export default NormalInputNumber;
