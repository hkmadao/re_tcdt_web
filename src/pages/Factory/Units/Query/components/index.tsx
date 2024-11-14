import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import style from './Main.less';
import store from '../store';
import Left from './Left';
import Center from './Center';
import Right from './Right';
import { useStatus } from '../hooks';
import { Spin } from 'antd';

const Main: React.FC = () => {
  const status = useStatus();
  return (
    <div className={style.main}>
      <Spin spinning={status === 'loading'}>
        <DndProvider backend={HTML5Backend}>
          <Left />
          <Center />
          <Right />
        </DndProvider>
      </Spin>
    </div>
  );
};

export default Main;
