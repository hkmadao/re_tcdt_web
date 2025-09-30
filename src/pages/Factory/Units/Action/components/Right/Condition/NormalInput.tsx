import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from 'antd';
import { actions } from '../../../store';
import { useCurrentButton } from '../../../hooks';

const NormalInput: FC<{ attr: 'label' | 'clickEventName' }> = ({ attr }) => {
  const currentButton = useCurrentButton();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>();

  useEffect(() => {
    if (currentButton) {
      setInputValue(currentButton[attr]);
      return;
    }
    setInputValue(undefined);
  }, [currentButton]);

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    if (currentButton) {
      dispatch(
        actions.updateCondition({ ...currentButton, [attr]: inputValue }),
      );
    }
  };

  return (
    <>
      <Input
        size={'small'}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </>
  );
};

export default NormalInput;
