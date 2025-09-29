import React, { ChangeEvent, FC } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import { actions } from '../../../../../store';
import { useTableBillFormField, useCurrentData } from '../../../../../hooks';

const NormalInput: FC<{
  attr: 'name' | 'displayName' | 'refAttributeName' | 'defaultValue';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const tableBillFormField = useTableBillFormField();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (currentData) {
      dispatch(
        actions.updateTableBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...tableBillFormField, [attr]: e.target.value },
        }),
      );
    }
  };

  return (
    <>
      <Input
        size={'small'}
        onChange={handleChange}
        value={tableBillFormField?.[attr]}
      />
    </>
  );
};

export default NormalInput;
