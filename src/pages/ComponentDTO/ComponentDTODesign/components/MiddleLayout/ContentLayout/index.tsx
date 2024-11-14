import { FC, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Diagram from './Diagram';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';

const ContentLayout: FC = (props) => {
  const middleLayout = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      if (middleLayout.current) {
        const width = middleLayout.current.getBoundingClientRect().width;
        const height = middleLayout.current.getBoundingClientRect().height;
        // console.log(width, height);
        dispatch(actions.updateContentUi({ width, height }));
      }
    }, 500);
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
