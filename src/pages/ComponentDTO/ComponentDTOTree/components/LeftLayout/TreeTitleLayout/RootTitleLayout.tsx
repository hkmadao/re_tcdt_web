import { FC, useEffect, useState } from 'react';
import { Space } from 'antd';
import { TTree } from '@/pages/ComponentDTO/ComponentDTOTree/models';

const RootTitleLayout: FC<TTree> = ({ name, ...props }) => {
  useEffect(() => {}, []);

  const handleDoubleClick = () => {};

  return (
    <>
      <span onDoubleClick={handleDoubleClick}>
        <Space size={30}>
          <span>{props.displayName}</span>
        </Space>
      </span>
    </>
  );
};

export default RootTitleLayout;
