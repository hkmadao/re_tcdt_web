import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Condition from './Condition';
import Panel from './Panel';
import { useCurrentButton } from '../../hooks';

const Right = () => {
  const searchRef = useCurrentButton();
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
