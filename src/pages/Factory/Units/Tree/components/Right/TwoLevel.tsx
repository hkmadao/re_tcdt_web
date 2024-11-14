import { Tree, TreeProps } from 'antd';
import React, { Key, useState } from 'react';

type TTree = {
  key: string;
  title: string;
  children: TTree[];
};

const treeData: TTree[] = [
  {
    key: '1',
    title: 'X总公司',
    children: [
      {
        key: '1-1',
        title: 'X1分公司',
        children: [
          {
            key: '1-1-1',
            title: '开发部',
            children: [],
          },
          {
            key: '1-1-2',
            title: '财务部',
            children: [],
          },
          {
            key: '1-1-3',
            title: '市场部',
            children: [],
          },
        ],
      },
      {
        key: '1-2',
        title: 'X2分公司',
        children: [
          {
            key: '1-2-1',
            title: '开发部',
            children: [],
          },
          {
            key: '1-2-2',
            title: '财务部',
            children: [],
          },
          {
            key: '1-2-3',
            title: '市场部',
            children: [],
          },
        ],
      },
      {
        key: '1-3',
        title: 'X3分公司',
        children: [
          {
            key: '1-3-1',
            title: '开发部',
            children: [],
          },
        ],
      },
    ],
  },
];

function TwoLevel() {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  /** 树主配置 */
  const treeConfig: TreeProps = {
    treeData: treeData,
    defaultExpandAll: true,
    showIcon: true,
  };

  return <Tree {...treeConfig} />;
}

export default TwoLevel;
