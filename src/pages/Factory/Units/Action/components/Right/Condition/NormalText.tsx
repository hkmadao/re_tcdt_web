import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from 'antd';
import { actions } from '../../../store';
import { useCurrentButton } from '../../../hooks';

const NormalText: FC<{ attr: 'disableScript' | 'hiddenScript' }> = ({
  attr,
}) => {
  const searchRef = useCurrentButton();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>();

  useEffect(() => {
    if (searchRef) {
      setInputValue(searchRef[attr]);
      return;
    }
    setInputValue(undefined);
  }, [searchRef]);

  const hanleleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    if (searchRef) {
      dispatch(
        actions.updateCondition({ ...searchRef, [attr]: inputValue ?? '' }),
      );
    }
  };

  return (
    <>
      <Input.TextArea
        autoSize={{ minRows: 3, maxRows: 5 }}
        value={inputValue}
        onChange={hanleleChange}
        onBlur={handleBlur}
      />
    </>
  );
};

export default NormalText;
