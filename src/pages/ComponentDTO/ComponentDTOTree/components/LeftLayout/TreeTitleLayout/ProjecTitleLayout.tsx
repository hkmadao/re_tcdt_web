import { FC, useEffect } from 'react';
import { Space } from 'antd';
import { TTree } from '@/pages/ComponentDTO/ComponentDTOTree/models';

type TProjecTitlePros = {} & TTree;

const ProjecTitleLayout: FC<TProjecTitlePros> = ({ ...props }) => {
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

export default ProjecTitleLayout;
