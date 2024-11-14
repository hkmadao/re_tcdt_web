/* eslint-disable @typescript-eslint/no-shadow */
import React, { Key, useEffect, useState } from 'react';
import type { TreeProps } from 'antd';
import { Tree } from 'antd';
import DragTreeNode from './DragTreeNode';
import { TDescriptionInfo } from '../model';
import { DataNode } from 'antd/lib/tree';

const DragTree: React.FC<{ treeData: TDescriptionInfo[] }> = ({ treeData }) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [treeSelectKeys, setTreeSelectKeys] = useState<Key[]>([]);
  /** 首次进入页面发 */
  useEffect(() => {
    if (treeData && treeData.length > 0) {
      setExpandedKeys([treeData[0].key]);
    }
  }, [treeData]);

  /** 树主配置 */
  const treeConfig: TreeProps = {
    treeData: treeData,
    expandedKeys,
    selectedKeys: treeSelectKeys,
    showIcon: false,
    onExpand: (keys, { node }) => {
      setExpandedKeys(keys);
      console.log(node);
    },
    onSelect: (keys, { node }) => {
      if (keys && keys.length > 0) {
        setTreeSelectKeys(keys);
      }
      if (node.children && node.children.length > 0) {
        toggleExpand(node.key as string);
      }
    },
    titleRender: (nodeData: DataNode) => {
      return (
        <>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            <DragTreeNode {...nodeData} />
          </span>
        </>
      );
    },
  };

  const toggleExpand = (currentKey: string | number) => {
    if (expandedKeys.includes(currentKey)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== currentKey));
      return;
    }
    setExpandedKeys(expandedKeys.concat([currentKey]));
  };

  return (
    <>
      <div>
        {treeData && treeData.length > 0 ? <Tree {...treeConfig} /> : ''}
      </div>
    </>
  );
};

export default DragTree;
