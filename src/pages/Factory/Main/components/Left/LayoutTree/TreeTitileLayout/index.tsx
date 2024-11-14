import { TLayout } from '@/pages/Factory/Main/model';
import { FC } from 'react';
import LayoutTitleLayout from './LayoutTitleLayout';
import ComponentTitleLayout from './ComponentTitleLayout';

const TreeTitleLayout: FC<TLayout> = ({ ...layout }) => {
  return (
    <>
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {layout.type === 'layout' ? (
          <LayoutTitleLayout {...layout} />
        ) : (
          <ComponentTitleLayout {...layout} />
        )}
      </span>
    </>
  );
};

export default TreeTitleLayout;
