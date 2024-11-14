import React from 'react';

function Bottom() {
  return (
    <div
      style={{
        flex: '0 1 auto',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          backgroundColor: '#6fb8fb',
          textAlign: 'center',
        }}
      >
        字段说明
      </div>
      <div>字段说明...</div>
    </div>
  );
}

export default Bottom;
