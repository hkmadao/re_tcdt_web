import { Component, FC, LegacyRef, useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';

type TCustomDatePickProps = {
  showTime?: boolean;
  format?: string;
  value?: string;
  onChange?: any;
};

const CustomDatePick: FC<TCustomDatePickProps> = ({
  showTime,
  format,
  value,
  onChange,
}) => {
  const [dateValue, setDateValue] = useState<any>();
  const inputDisplayRef = useRef<Component<PickerProps<Moment>>>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (value) {
      const date = moment(value, format ?? 'YYYY-MM-DD');
      setDateValue(date);
    }
  }, [value]);

  const handleChange = (value: any, dateString: string) => {
    onChange(dateString);
  };

  return (
    <>
      <DatePicker
        allowClear
        onChange={handleChange}
        value={dateValue}
        ref={inputDisplayRef}
        format={format ?? 'YYYY-MM-DD'}
        showTime
      />
    </>
  );
};

export default CustomDatePick;
