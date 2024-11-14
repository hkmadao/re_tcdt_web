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
        children: [],
      },
      {
        key: '1-2',
        title: 'X2分公司',
        children: [],
      },
      {
        key: '1-3',
        title: 'X3分公司',
        children: [],
      },
    ],
  },
];

function OneLevel() {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  /** 树主配置 */
  const treeConfig: TreeProps = {
    treeData: treeData,
    defaultExpandAll: true,
    showIcon: true,
  };

  return <Tree {...treeConfig} />;
}

export default OneLevel;
