import Component from './components';
import { Provider } from 'react-redux';
import store from './store';

const QueryFactory: React.FC = () => {
  return (
    <Provider store={store}>
      <Component />
    </Provider>
  );
};

export default QueryFactory;
