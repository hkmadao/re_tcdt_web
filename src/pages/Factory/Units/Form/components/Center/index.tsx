import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Billform from './Billform';
import Billlist from './Billlist';
import { selectFgFrom } from '../../store';

const Center: FC = () => {
  const fgForm = useSelector(selectFgFrom);
  return (
    <div
      style={{
        display: 'flex',
        flex: '0 1 auto',
        flexDirection: 'column',
        width: '80%',
        margin: '5px 0px 5px 0px',
        backgroundColor: 'white',
      }}
    >
      {fgForm ? <Billform /> : <Billlist />}
    </div>
  );
};

export default Center;
