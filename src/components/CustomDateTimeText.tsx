import { FC, useEffect, useState } from 'react';
import moment from 'moment';

type TCustomDateTimeTextProps = {
  format?: string;
  displayFormat?: string;
  value?: string;
};

const CustomDateTimeText: FC<TCustomDateTimeTextProps> = ({
  format,
  displayFormat,
  value,
}) => {
  const [dateValueText, setDateValueText] = useState<string>('---');

  useEffect(() => {}, []);

  useEffect(() => {
    if (value) {
      const date = moment(value, format ?? 'YYYY-MM-DD');
      const dateValueText = date.format(displayFormat ?? 'YYYY-MM-DD HH:mm:ss');
      setDateValueText(dateValueText);
    }
  }, [value]);

  return (
    <>
      <span>{dateValueText}</span>
    </>
  );
};

export default CustomDateTimeText;
