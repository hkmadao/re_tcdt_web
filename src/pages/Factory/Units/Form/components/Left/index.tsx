import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Middle from './Billform/Middle';
import Bottom from './Billform/Bottom';
import Action from './Action';
import { selectFgFrom } from '../../store';
import ListMiddle from './Billlist/Middle';
import ListBottom from './Billlist/Bottom';

const index = () => {
  const dispatch = useDispatch();
  const fgForm = useSelector(selectFgFrom);

  useEffect(() => {}, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
        margin: '5px',
        backgroundColor: 'white',
        flex: 'auto',
      }}
    >
      <Action />
      <Header />
      {fgForm ? <Middle /> : <ListMiddle />}
      {fgForm ? <Bottom /> : <ListBottom />}
    </div>
  );
};

export default index;
