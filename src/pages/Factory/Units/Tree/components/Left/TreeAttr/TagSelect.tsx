import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import { actions, selectTreeContent } from '../../../store';
import { useMainEntityAttrs } from '../../../hooks';

const TagSelect: FC<{ attr: 'searchAttrs' }> = ({ attr }) => {
  const attrs = useMainEntityAttrs();
  const treeContent = useSelector(selectTreeContent);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string[]>([]);
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (treeContent) {
      setInputValue(treeContent[attr]);
    }
  }, [treeContent]);

  const handleChange = (values: string[]) => {
    setInputValue(values);
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
      <Select
        mode="tags"
        size={'small'}
        value={inputValue}
        onBlur={handleBlur}
        ref={selectRef}
        style={{ width: '100%' }}
        placeholder="请输入"
        onChange={handleChange}
        options={attrs}
      />
    </>
  );
};

export default TagSelect;
