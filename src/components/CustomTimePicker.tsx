import { FC, LegacyRef, useEffect, useRef, useState } from 'react';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';

type TCustomTimePickerProps = {
  format?: string;
  value?: string;
  onChange?: any;
};

const CustomTimePicker: FC<TCustomTimePickerProps> = ({
  format,
  value,
  onChange,
}) => {
  const [dateValue, setDateValue] = useState<any>();
  const inputDisplayRef = useRef<LegacyRef<Moment>>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (value) {
      const date = moment(value, format ?? 'HH:mm:ss');
      setDateValue(date);
    }
  }, [value]);

  const handleChange = (value: any, timeString: string) => {
    onChange(timeString);
  };

  return (
    <>
      <TimePicker
        allowClear
        onChange={handleChange}
        value={dateValue}
        ref={inputDisplayRef}
        format={format ?? 'HH:mm:ss'}
      />
    </>
  );
};

export default CustomTimePicker;
