import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import { actions } from '../../../../../store';
import { useBillFormField, useCurrentData } from '../../../../../hooks';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const NormalCheckbox: FC<{
  attr: 'fgTreeAttr' | 'readonly' | 'fgDisplay';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormField = useBillFormField();
  const dispatch = useDispatch();

  const handleChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    if (currentData) {
      dispatch(
        actions.updateBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...billFormField, [attr]: checked },
        }),
      );
    }
  };

  return (
    <>
      <Checkbox checked={billFormField?.[attr]} onChange={handleChange} />
    </>
  );
};

export default NormalCheckbox;
