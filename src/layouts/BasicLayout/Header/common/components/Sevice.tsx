import { FC } from 'react';
import { Select } from 'antd';

const Sevice: FC = () => {
  const handleServiceChange = (value: string) => {
    window.localStorage.setItem('service', value);
  };

  return (
    <>
      <Select
        value={window.localStorage.getItem('service') ?? 'Rust'}
        style={{ width: 100, display: 'none' }}
        onChange={handleServiceChange}
        options={[
          {
            value: 'Rust',
            label: 'Rust',
          },
          {
            value: 'Java',
            label: 'Java',
          },
        ]}
      />
    </>
  );
};

export default Sevice;
