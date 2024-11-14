import React, { FC } from 'react';
import DropBody from './DropBody';

const index: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flex: '0 1 auto',
        width: '60%',
        margin: '5px 0px 5px 0px',
        backgroundColor: 'white',
      }}
    >
      <DropBody />
    </div>
  );
};

export default index;
