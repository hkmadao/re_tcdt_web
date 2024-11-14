import { FC } from 'react';
import { Space } from 'antd';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';

type TProjecTitlePros = {} & TTree;

const ProjecTitleLayout: FC<TProjecTitlePros> = ({ ...props }) => {
  return (
    <>
      <span>
        <Space size={30}>
          <span>{props.displayName}</span>
        </Space>
      </span>
    </>
  );
};

export default ProjecTitleLayout;
