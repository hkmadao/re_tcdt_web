import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import style from './Main.less';
import Left from './Left';
import Center from './Center';
import Right from './Right';
import { Spin } from 'antd';
import { useStatus } from '../hooks';

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
