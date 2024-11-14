import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from './Layout';
import Page from './Page';
import { selectCurrentLayout } from '../../store';
import { useFgLoadData } from '../../hooks';

const Right: FC = () => {
  const currentLayout = useSelector(selectCurrentLayout);
  const fgLoadData = useFgLoadData();

  useEffect(() => {}, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          width: '20%',
          margin: '5px',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: fgLoadData ? 'flex' : 'none',
            flex: 'auto',
          }}
        >
          {!!currentLayout ? <Layout /> : <Page />}
        </div>
      </div>
    </>
  );
};

export default Right;
