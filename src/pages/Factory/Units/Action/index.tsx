import Component from './components';
import { Provider } from 'react-redux';
import store from './store';

const ActionFactory: React.FC = () => {
  return (
    <Provider store={store}>
      <Component />
    </Provider>
  );
};

export default ActionFactory;
