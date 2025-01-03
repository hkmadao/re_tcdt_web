import React, { FC, useEffect, useRef } from 'react';
import FileTree from './FileTree';
import CodeEditArea from './CodeEditArea';

const Center: FC = () => {
  useEffect(() => {}, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          margin: '5px 0px 5px 0px',
          overflow: 'auto',
          gap: '5px',
        }}
      >
        <FileTree />
        <CodeEditArea />
      </div>
    </>
  );
};

export default Center;
