import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, InputRef } from 'antd';
import { actions } from '../../../store';
import { useCurrentSearchRef } from '../../../hooks';

const NormalInput: FC<{
  attr: 'label' | 'attributeName' | 'refAttributeName' | 'defaultValue';
}> = ({ attr }) => {
  const searchRef = useCurrentSearchRef();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>();
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (searchRef) {
      setInputValue(searchRef[attr]);
      return;
    }
    setInputValue(undefined);
  }, [searchRef]);

  const handleChange = (e: any) => {
    setInputValue(inputRef.current?.input?.value);
  };

  const handleBlur = () => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, [attr]: inputValue }));
    }
  };

  return (
    <>
      <Input
        size={'small'}
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </>
  );
};

export default NormalInput;
