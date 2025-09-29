import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions, selectCurrentSearchRef } from '../../../store';

const SearchAttributes: FC = () => {
  const { Option } = Select;
  const searchRef = useSelector(selectCurrentSearchRef);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleChange = (value: string[]) => {
    if (searchRef) {
      dispatch(
        actions.updateCondition({ ...searchRef, searchAttributes: value }),
      );
    }
  };

  return (
    <>
      <Select
        size={'small'}
        mode="tags"
        value={searchRef?.searchAttributes}
        onChange={handleChange}
        style={{ minWidth: '100px' }}
      >
        <Option value={searchRef?.attributeName}>
          {searchRef?.attributeName}
        </Option>
        <Option value={'code'}>code</Option>
        <Option value={'displayName'}>displayName</Option>
      </Select>
    </>
  );
};

export default SearchAttributes;
