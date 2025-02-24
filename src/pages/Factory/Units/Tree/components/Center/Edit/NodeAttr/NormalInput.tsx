import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AutoComplete } from 'antd';
import { actions, selectCurrentNodeTreeRef } from '../../../../store';
import { useMainEntityAttrs } from '../../../../hooks';

const NormalInput: FC<{
  attr: 'keyAttr' | 'labelAttr' | 'parentIdAttr';
}> = ({ attr }) => {
  const attrs = useMainEntityAttrs();
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

  useEffect(() => {
    if (attrs.length > 0) {
      setOptions(attrs);
    }
  }, []);

  const handleFocus = (e: any) => {
    const sourceOptions = attrs;
    const ops = sourceOptions.filter((o) => o.value.includes(inputValue ?? ''));
    setOptions(ops);
  };

  const handleSearch = (searchText: string) => {
    const sourceOptions = attrs;
    const ops = sourceOptions.filter((o) => o.value.includes(searchText));
    setOptions(ops);
  };

  const handleSelect = (data: string) => {};

  const handleChange = (data: string) => {
    setInputValue(data);
  };

  const handleBlur = () => {
    if (treeRef) {
      dispatch(actions.updateNodeTreeRef({ ...treeRef, [attr]: inputValue }));
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

export default NormalInput;
