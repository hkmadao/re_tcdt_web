import { FC } from 'react';
import { Space } from 'antd';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';

const RootTitleLayout: FC<TTree> = ({ name, ...props }) => {
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

export default RootTitleLayout;
