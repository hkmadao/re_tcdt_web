import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Condition from './Condition';
import { selectCurrentSearchRef } from '../../store';
import Panel from './Panel';

const Right = () => {
  const searchRef = useSelector(selectCurrentSearchRef);
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
