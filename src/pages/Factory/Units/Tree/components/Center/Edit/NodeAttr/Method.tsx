import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions, selectCurrentNodeTreeRef } from '../../../../store';
import { EInputType } from '@/pages/Factory/Units/common/model';

const Method: FC = () => {
  const { Option } = Select;
  const treeRef = useSelector(selectCurrentNodeTreeRef);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleChange = (value: 'POST' | 'GET') => {
    if (treeRef) {
      dispatch(actions.updateNodeTreeRef({ ...treeRef, method: value }));
    }
  };

  return (
    <>
      <Select
        size={'small'}
        value={treeRef?.method || 'POST'}
        onChange={handleChange}
      >
        <Option value={'POST'}>POST</Option>
        <Option value={'GET'}>GET</Option>
      </Select>
    </>
  );
};

export default Method;
