import { FC } from 'react';
import { Provider } from 'react-redux';
import MainLayout from './main';
import store from './store';

const Descript: FC = () => {
  return (
    <>
      <Provider store={store}>
        <MainLayout />
      </Provider>
    </>
  );
};

export default Descript;
