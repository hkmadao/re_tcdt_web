import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import style from './Main.less';
import store from '../store';
import Center from './Center';
import Right from './Right';
import Left from './Left';

const Main: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={style.main}>
        <DndProvider backend={HTML5Backend}>
          <Left />
          <Center />
          <Right />
        </DndProvider>
      </div>
    </Provider>
  );
};

export default Main;
