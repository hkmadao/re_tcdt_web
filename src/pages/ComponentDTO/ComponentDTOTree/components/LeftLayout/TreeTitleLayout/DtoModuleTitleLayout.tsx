import { FC } from 'react';
import { Space } from 'antd';
import { TTree } from '@/pages/ComponentDTO/ComponentDTOTree/models';

type TDtoModuleTitlePros = {} & TTree;

const ModuleTitleLayout: FC<TDtoModuleTitlePros> = ({ ...props }) => {
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

export default ModuleTitleLayout;
