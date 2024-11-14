import { Button } from 'antd';
import React, { FC } from 'react';

const SelectPath: FC<{
  value?: string;
  onChange?: (value?: string) => void;
}> = ({ value, onChange }) => {
  const handleConf = async () => {
    const result = await window.tcdtAPI.selectPath(value);
    if (result.canceled) {
      return;
    }
    console.log(result);
    if (result.filePaths.length === 1 && onChange) {
      onChange(result.filePaths.join());
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
      }}
    >
      <div style={{ minWidth: '200px' }}>{value ?? '---'}</div>
      <div>
        <Button onClick={handleConf}>配置</Button>
      </div>
    </div>
  );
};

export default SelectPath;
