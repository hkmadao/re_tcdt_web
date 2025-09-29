import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import { actions } from '../../../../../store';
import { useTableBillFormField, useCurrentData } from '../../../../../hooks';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const NormalCheckbox: FC<{
  attr: 'fgTreeAttr' | 'fgDisplay';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const tableBillFormField = useTableBillFormField();
  const dispatch = useDispatch();

  const handleChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    if (currentData) {
      dispatch(
        actions.updateTableBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...tableBillFormField, [attr]: checked },
        }),
      );
    }
  };

  return (
    <>
      <Checkbox checked={tableBillFormField?.[attr]} onChange={handleChange} />
    </>
  );
};

export default NormalCheckbox;
