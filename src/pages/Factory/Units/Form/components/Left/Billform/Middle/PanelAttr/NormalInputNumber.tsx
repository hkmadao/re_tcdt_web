import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import { actions } from '../../../../../store';
import { useBillFormTab, useCurrentData } from '../../../../../hooks';

const NormalInputNumber: FC<{
  attr: 'tabIndex';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormTab = useBillFormTab();
  const dispatch = useDispatch();

  const handleChange = (value: number | null) => {
    const newValue = value === null ? undefined : value;
    if (currentData) {
      dispatch(
        actions.updateBillFormTab({
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
