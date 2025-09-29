import React, { ChangeEvent, FC } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import { actions } from '../../../../../store';
import { useBillFormField, useCurrentData } from '../../../../../hooks';

const NormalInput: FC<{
  attr:
    | 'name'
    | 'displayName'
    | 'placeholder'
    | 'refAttributeName'
    | 'defaultValue';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormField = useBillFormField();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (currentData) {
      dispatch(
        actions.updateBillFormField({
          name: currentData.name,
          tabCode: currentData.tabCode!,
          dto: { ...billFormField, [attr]: e.target.value },
        }),
      );
    }
  };

  return (
    <>
      <Input
        size={'small'}
        onChange={handleChange}
        value={billFormField?.[attr]}
      />
    </>
  );
};

export default NormalInput;
