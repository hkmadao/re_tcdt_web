import { TTree } from '@/models';
import { TreeProps, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { FC, Key, useState } from 'react';

const TreePriview: FC<{ idConf: string }> = ({ idConf }) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(['1', '1-1']);
  const [treeSelectKeys, setTreeSelectKeys] = useState<Key[]>([]);
  const treeData: TTree[] = [
    {
      key: '1',
      title: '节点1',
      id: '1',
      displayName: '节点1',
      children: [
        {
          key: '1-1',
          title: '节点1-1',
          id: '1-1',
          displayName: '节点1-1',
          children: [],
        },
        {
          key: '1-2',
          title: '节点1-2',
          id: '1-2',
          displayName: '节点1-2',
          children: [
            {
              key: '1-2-1',
              title: '节点1-2-1',
              id: '1-2-1',
              displayName: '节点1-2-1',
              children: [],
            },
          ],
        },
      ],
    },
    {
      key: '2',
      title: '节点2',
      id: '2',
      displayName: '节点2',
      children: [
        {
          key: '2-1',
          title: '节点2-1',
          id: '2-1',
          displayName: '节点2-1',
          children: [],
        },
      ],
    },
  ];

  /** 树主配置 */
  const treeConfig: TreeProps = {
    treeData: treeData,
    expandedKeys,
    selectedKeys: treeSelectKeys,
    showLine: { showLeafIcon: false },
    showIcon: false,
    onExpand: (keys, { node }) => {
      setExpandedKeys(keys);
    },
    onSelect: (keys, { node }) => {
      if (keys && keys.length > 0) {
        setTreeSelectKeys(keys);
      }
      if (node.children && node.children.length > 0) {
        toggleExpand(node.key);
      }
    },
    titleRender: (nodeData: DataNode) => {
      const treeNode = nodeData as TTree;
      return (
        <>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {treeNode.displayName}
          </span>
        </>
      );
    },
  };

  const toggleExpand = (currentKey: Key) => {
    if (expandedKeys.includes(currentKey)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== currentKey));
      return;
    }
    setExpandedKeys(expandedKeys.concat([currentKey]));
  };

  return (
    <>
      <div>
        <Tree {...treeConfig} />
      </div>
    </>
  );
};

export default TreePriview;
