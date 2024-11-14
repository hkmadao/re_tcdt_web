import { FC, useEffect } from 'react';
import { Space } from 'antd';
import { useDispatch } from 'react-redux';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';

type TProjecTitlePros = {} & TTree;

const ProjecTitleLayout: FC<TProjecTitlePros> = ({ ...props }) => {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

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
