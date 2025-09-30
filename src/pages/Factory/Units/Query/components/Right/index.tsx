import React from 'react';
import Condition from './Condition';
import Panel from './Panel';
import { useCurrentSearchRef } from '../../hooks';

const Right = () => {
  const searchRef = useCurrentSearchRef();
  return (
    <div
      style={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        width: '20%',
        margin: '5px 5px 5px 5px',
        backgroundColor: 'white',
      }}
    >
      {searchRef ? <Condition /> : <Panel />}
    </div>
  );
};

export default Right;
