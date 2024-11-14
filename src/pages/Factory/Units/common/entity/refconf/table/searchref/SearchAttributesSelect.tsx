import { FC, useEffect, useRef, useState } from 'react';
import { Select } from 'antd';

const SearchAttributesSelect: FC<{ value?: string[]; onChange?: any }> = ({
  value,
  onChange,
}) => {
  const [selectValues, setSelectValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectValues(value || []);
  }, []);

  const handleChange = (changeValues: string[]) => {
    setSelectValues(changeValues);
    onChange(changeValues);
  };

  return (
    <>
      <Select
        mode="tags"
        value={selectValues}
        style={{ width: '100%' }}
        placeholder=""
        options={[]}
        onChange={handleChange}
      />
    </>
  );
};
export default SearchAttributesSelect;
