import React, { ChangeEvent, FC } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import { actions } from '../../../../../store';
import { useBillFormTab, useCurrentData } from '../../../../../hooks';

const NormalInput: FC<{
  attr:
    | 'tabName'
    | 'tabCode'
    | 'firstUpperTabCode'
    | 'tabClassName'
    | 'firstLowerTabClassName'
    | 'tabAttrName'
    | 'firstUpperTabAttrName';
}> = ({ attr }) => {
  const currentData = useCurrentData();
  const billFormTab = useBillFormTab();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (currentData) {
      dispatch(
        actions.updateBillFormTab({
          name: currentData.name,
          dto: { ...billFormTab, [attr]: e.target.value },
        }),
      );
    }
  };

  return (
    <>
      <Input
        size={'small'}
        onChange={handleChange}
        value={billFormTab?.[attr]}
      />
    </>
  );
};

export default NormalInput;
