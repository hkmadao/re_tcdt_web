import {
  andLogicNode,
  equalFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';
import { EnumTreeNodeType } from '@/pages/ComponentData/ComponentTree/conf';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import { Tree } from 'antd';
import { FC, Key, useEffect, useState } from 'react';
import { fillTreeKey, getUpKeysByKey } from '@/util';
import DescriptTreeAPI from '@/pages/DescriptData/DescriptTree/api';
import { TCompUpTreeInfo } from './model';
import {
  findProjectUpTreeInfoByNodeId,
  findSubProjectUpTreeInfoByNodeId,
} from './utils';

export const getInitExpandKeys = (tree: TTree[]): Key[] => {
  const keys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.level === EnumTreeNodeType.PROJECT) {
      keys.push(node.key);
      break;
    }
    if (node.children && node.children.length > 0) {
      const childResult = getInitExpandKeys(node.children);
      if (childResult.length > 0) {
        keys.push(...childResult);
        keys.push(node.key);
        break;
      }
    }
  }
  return keys;
};

const SubProjectTree: FC<{
  idSubProject?: string;
  idTreeSelected?: string;
  idSelected?: string;
  handleSelect: (nodeData?: TCompUpTreeInfo) => void;
  fgLoadData: boolean;
  setSpinning?: (fgSpinning: boolean) => void;
}> = ({
  idSubProject,
  idTreeSelected,
  idSelected,
  handleSelect,
  fgLoadData,
  setSpinning,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedTreeKeys, setSelectedTreeKeys] = useState<Key[]>([]);
  const [treeData, setTreeData] = useState<TTree[]>([]);

  useEffect(() => {
    if (fgLoadData) {
      fetchData();
    }
  }, [fgLoadData]);

  /**获取组件树 */
  const fetchData = async () => {
    let condition: TCondition = {};
    if (idSubProject) {
      condition = {
        logicNode: andLogicNode([
          equalFilterNode('idSubProject', stringFilterParam(idSubProject)),
        ])(),
      };
    }
    const subProjectTree = await DescriptTreeAPI.subProjectTree();
    if (subProjectTree) {
      const tree = fillTreeKey(subProjectTree);
      setTreeData(tree);
      if (idTreeSelected) {
        const expandedKeys = getUpKeysByKey(idTreeSelected, tree);
        setExpandedKeys(expandedKeys);
        setSelectedTreeKeys([idTreeSelected]);
        let result: TCompUpTreeInfo = {};
        findSubProjectUpTreeInfoByNodeId(idTreeSelected, result, tree);
        handleSelect(result);
      } else {
        const expandedKeys = getInitExpandKeys(tree);
        setExpandedKeys(expandedKeys);
        setSelectedTreeKeys([]);
      }
    }
  };

  /**点击组件 */
  const handleTreeClick = (nodeData: TTree) => {
    return () => {};
  };

  const onSelect = (keys: React.Key[], { node }: { node: TTree }) => {
    if (node.children && node.children.length > 0) {
      toggleExpand(node.key);
    }
    if (!keys || keys.length === 0) {
      setSelectedTreeKeys(selectedTreeKeys);
      return;
    }
    if (node.children && node.children.length > 0) {
      toggleExpand(node.key);
    }
    let result: TCompUpTreeInfo = {};
    if (node.level === EnumTreeNodeType.SUB_PROJECT) {
      findSubProjectUpTreeInfoByNodeId(node.id!, result, treeData);
      handleSelect(result);
    } else if (node.level === EnumTreeNodeType.PROJECT) {
      findProjectUpTreeInfoByNodeId(node.id!, result, treeData);
      handleSelect(result);
    } else {
      handleSelect(undefined);
    }
    setSelectedTreeKeys(keys);
  };

  const toggleExpand = (currentKey: string | number) => {
    if (expandedKeys.includes(currentKey)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== currentKey));
      return;
    }
    setExpandedKeys(expandedKeys.concat([currentKey]));
  };

  const onExpand = (
    keys: React.Key[],
    { node }: { node: TTree; expanded: boolean },
  ) => {
    toggleExpand(node.key);
  };

  const titleRender = (nodeData: TTree) => {
    return (
      <span onClick={handleTreeClick(nodeData)}>{nodeData.displayName}</span>
    );
  };

  return (
    <>
      <Tree
        showLine={{ showLeafIcon: false }}
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        treeData={treeData}
        selectedKeys={selectedTreeKeys}
        titleRender={titleRender}
      />
    </>
  );
};

export default SubProjectTree;
