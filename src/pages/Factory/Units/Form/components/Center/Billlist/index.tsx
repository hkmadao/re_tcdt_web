import React, { useState } from 'react';
import Header from './Header';
import Body from './Body';
import Bottom from './Bottom';

function Billlist() {
  const [bottomExpanded, setBottomExpanded] = useState<boolean>(true);
  const [bodyExpanded, setBodyExpanded] = useState<boolean>(true);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 40%',
          overflow: 'auto',
        }}
      >
        <Header />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: bodyExpanded ? '0 1 40%' : '0 1 auto',
          overflow: 'auto',
        }}
      >
        <Body setExpand={setBodyExpanded} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: bottomExpanded ? '0 1 20%' : '0 1 auto',
          overflow: 'auto',
        }}
      >
        <Bottom setExpand={setBottomExpanded} />
      </div>
    </>
  );
}

export default Billlist;
