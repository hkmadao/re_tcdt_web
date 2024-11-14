import { FC, useEffect, useRef } from 'react';
import { Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Diagram from './Diagram';
import { actions } from '@/pages/ComponentData/ComponentDesign/store';

const ContentLayout: FC = (props) => {
  const middleLayout = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (middleLayout.current) {
      const width = middleLayout.current.getBoundingClientRect().width;
      const height = middleLayout.current.getBoundingClientRect().height;
      dispatch(actions.updateDiagramUi({ width, height }));
    }
  }, []);

  return (
    <>
      <div
        ref={middleLayout}
        style={{
          display: 'flex',
          flex: 'auto',
          overflow: 'hidden',
        }}
      >
        <Diagram />
      </div>
    </>
  );
};

export default ContentLayout;
