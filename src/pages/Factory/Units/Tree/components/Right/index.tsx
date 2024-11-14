import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions, selectTwoLevelStatus } from '../../store';
import OneLevel from './OneLevel';
import TwoLevel from './TwoLevel';
import { useFgLoadData } from '../../hooks';

const Right: FC = () => {
  const twoLevelStatus = useSelector(selectTwoLevelStatus);
  const fgLoadData = useFgLoadData();

  return (
    <div
      style={{
        display: 'flex',
        flex: '0 1 auto',
        width: '40%',
        margin: '5px 0px 5px 0px',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: fgLoadData ? 'flex' : 'none',
          flex: 'auto',
        }}
      >
        {twoLevelStatus ? <TwoLevel /> : <OneLevel />}
      </div>
    </div>
  );
};

export default Right;
