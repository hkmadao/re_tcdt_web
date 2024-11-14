import { TTree } from '@/models';
import { Tree } from 'antd';
import React, { FC, Key, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRefProps } from '../../model';
import { fetchTableData, fetchTreeData } from '../../store/async-thunk';
import { actions, useSelectedNodes, useTreeData } from '../../store';

const LeftTree: FC<TRefProps> = (props) => {
  const dispatch = useDispatch();
  const { selectedNodeKeys } = useSelectedNodes();

  const treeData = useTreeData();

  useEffect(() => {
    if (props.refStyle === 'treeTable' || props.refStyle === 'tree') {
      dispatch(fetchTreeData({ refProps: props }));
    }
  }, []);

  const onSelect = (
    keys: React.Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: any;
      selectedNodes: any[];
    },
  ) => {
    // console.log('Trigger Select', keys, info);
    if (!props.billTreeRef) {
      return;
    }
    if (!keys || keys.length === 0) {
      dispatch(
        actions.setSelectedNodes({
          nodeKeys: info.node[props.billTreeRef.keyAttr!],
          nodes: [info.node],
        }),
      );
    } else {
      dispatch(
        actions.setSelectedNodes({ nodeKeys: keys, nodes: [info.node] }),
      );
    }
    const treeNodeId: string = info.node[props.billTreeRef.keyAttr!];
    dispatch(
      fetchTableData({
        refProps: props,
        idTreeNode: treeNodeId,
        pageSize: 10,
        pageIndex: 1,
      }),
    );
  };

  const onExpand = () => {
    // console.log('Trigger Expand');
  };
  return (
    <>
      <Tree
        showLine={true}
        showIcon={true}
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
        selectedKeys={selectedNodeKeys}
        titleRender={(nodeData) => {
          return <span>{nodeData.displayName}</span>;
        }}
      />
    </>
  );
};

export default LeftTree;
