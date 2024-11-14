import { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AutoComplete } from 'antd';
import { actions } from '../../../store';
import { useCurrentButton } from '../../../hooks';

const cenSourceOptions: { value: string }[] = [
  {
    value: 'handleSave',
  },
  {
    value: 'handleAddAgain',
  },
  {
    value: 'handleCancel',
  },
  {
    value: 'handleReflesh',
  },
  {
    value: 'handleToAdd',
  },
  {
    value: 'handleToEdit',
  },
  {
    value: 'handleRowsDelete',
  },
  {
    value: 'handleRowSelectType',
  },
  {
    value: 'handleReflesh',
  },
];

const typeSourceOptions: { value: string }[] = [
  {
    value: 'default',
  },
  {
    value: 'primary',
  },
  {
    value: 'ghost',
  },
  {
    value: 'dashed',
  },
  {
    value: 'link',
  },
  {
    value: 'text',
  },
];

const ClickEventNameInput: FC<{ attr: 'type' | 'clickEventName' }> = ({
  attr,
}) => {
  const dispatch = useDispatch();
  const searchRef = useCurrentButton();
  const [options, setOptions] = useState<{ value: string }[]>(
    attr === 'type' ? typeSourceOptions : cenSourceOptions,
  );
  const [inputValue, setInputValue] = useState<string>();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (!searchRef) {
      setInputValue(undefined);
      return;
    }
    setInputValue(searchRef[attr]);
  }, [searchRef]);

  const onSearch = (searchText: string) => {
    const sourceOptions =
      attr === 'type' ? typeSourceOptions : cenSourceOptions;
    const ops = sourceOptions.filter((o) => o.value.includes(searchText));
    setOptions(ops);
  };

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  const onChange = (data: string) => {
    setInputValue(data);
  };

  const handleBlur = () => {
    if (searchRef) {
      dispatch(actions.updateCondition({ ...searchRef, [attr]: inputValue }));
    }
  };

  return (
    <>
      <AutoComplete
        size={'small'}
        style={{ minWidth: '100px' }}
        ref={inputRef}
        value={inputValue}
        options={options}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder="请输入"
      />
    </>
  );
};

export default ClickEventNameInput;
