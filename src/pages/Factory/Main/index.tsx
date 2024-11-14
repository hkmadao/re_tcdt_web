import Component from './components';
import { Provider } from 'react-redux';
import store from './store';

const MainFactory: React.FC = () => {
  return (
    <Provider store={store}>
      <Component />
    </Provider>
  );
};

export default MainFactory;
