import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AutoComplete } from 'antd';
import { actions, selectTreeContent } from '../../../store';
import { useMainDisplayName } from '../../../hooks';

const DisplayNameInput: FC<{
  attr: 'displayName';
}> = ({ attr }) => {
  const displayName = useMainDisplayName();
  const treeContent = useSelector(selectTreeContent);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>();
  const inputRef = useRef<any>(null);
  const [options, setOptions] = useState<{ value: string }[]>([]);

  useEffect(() => {
    if (treeContent) {
      setInputValue(treeContent[attr]);
    }
  }, [treeContent]);

  const handleFocus = (e: any) => {
    const sourceOptions = [{ value: displayName ?? '' }];
    const ops = sourceOptions.filter((o) => o.value.includes(inputValue ?? ''));
    setOptions(ops);
  };

  const handleSearch = (searchText: string) => {
    const sourceOptions = [{ value: displayName ?? '' }];
    const ops = sourceOptions.filter((o) => o.value.includes(searchText));
    setOptions(ops);
  };

  const handleSelect = (data: string) => {};

  const handleChange = (data: string) => {
    setInputValue(data);
  };

  const handleBlur = () => {
    if (treeContent) {
      dispatch(
        actions.updateTreeContent({ ...treeContent, [attr]: inputValue }),
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

export default DisplayNameInput;
