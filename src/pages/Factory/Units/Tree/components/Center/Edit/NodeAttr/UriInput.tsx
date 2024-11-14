import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AutoComplete } from 'antd';
import { actions, selectCurrentNodeTreeRef } from '../../../../store';
import { useMainAttributeName } from '../../../../hooks';

const UriInput: FC<{
  attr: 'uri';
}> = ({ attr }) => {
  const attributeName = useMainAttributeName();
  const treeRef = useSelector(selectCurrentNodeTreeRef);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>();
  const inputRef = useRef<any>(null);
  const [options, setOptions] = useState<{ value: string }[]>([]);

  useEffect(() => {
    if (treeRef) {
      setInputValue(treeRef[attr]);
    }
  }, [treeRef]);

  const handleFocus = (e: any) => {
    const sourceOptions = [{ value: '/' + (attributeName ?? '') + '/aq' }];
    const ops = sourceOptions.filter((o) => o.value.includes(inputValue ?? ''));
    setOptions(ops);
  };

  const handleSearch = (searchText: string) => {
    const sourceOptions = [{ value: '/' + (attributeName ?? '') + '/aq' }];
    const ops = sourceOptions.filter((o) => o.value.includes(searchText));
    setOptions(ops);
  };

  const handleSelect = (data: string) => {
    console.log('onSelect', data);
  };

  const handleChange = (data: string) => {
    setInputValue(data);
  };

  const handleBlur = () => {
    if (treeRef) {
      dispatch(
        actions.updateNodeTreeRef({ ...treeRef, [attr]: inputValue ?? '' }),
      );
    }
  };

  return (
    <>
      <AutoComplete
        size={'small'}
        style={{ minWidth: '200px' }}
        ref={inputRef}
        value={inputValue}
        options={options}
        onFocus={handleFocus}
        onSelect={handleSelect}
        onSearch={handleSearch}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="请输入"
      />
    </>
  );
};

export default UriInput;
