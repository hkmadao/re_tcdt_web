import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import { actions } from '../../../../../store';
import { useBillFormTab, useCurrentData } from '../../../../../hooks';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const NormalCheckbox: FC<{
  attr: 'fgDefaultTab';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormTab = useBillFormTab();
  const dispatch = useDispatch();

  const handleChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    if (currentData) {
      dispatch(
        actions.updateBillFormTab({
          name: currentData.name,
          dto: { ...billFormTab, [attr]: checked },
        }),
      );
    }
  };

  return (
    <>
      <Checkbox checked={billFormTab?.[attr]} onChange={handleChange} />
    </>
  );
};

export default NormalCheckbox;
