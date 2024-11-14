import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import style from './Main.less';
import store from '../store';

const Main: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={style.main}>
        <DndProvider backend={HTML5Backend}>To Be Design...</DndProvider>
      </div>
    </Provider>
  );
};

export default Main;
