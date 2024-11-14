import { FC } from 'react';
import { Space } from 'antd';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';

type TModuleTitlePros = {} & TTree;

const SubProjectTitleLayout: FC<TModuleTitlePros> = ({ ...props }) => {
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

export default SubProjectTitleLayout;
